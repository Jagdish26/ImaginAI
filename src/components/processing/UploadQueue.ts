// Upload queue management system
export interface QueueItem {
  id: string;
  file: File;
  priority: number;
  status: 'waiting' | 'uploading' | 'completed' | 'error';
  progress: number;
  uploadSpeed?: number;
  estimatedTime?: number;
  retryCount: number;
  maxRetries: number;
  onProgress?: (progress: number) => void;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

export class UploadQueue {
  private queue: QueueItem[] = [];
  private activeUploads: Map<string, AbortController> = new Map();
  private maxConcurrentUploads: number = 3;
  private isProcessing: boolean = false;

  constructor(maxConcurrentUploads: number = 3) {
    this.maxConcurrentUploads = maxConcurrentUploads;
  }

  // Add file to queue
  addFile(
    file: File, 
    options: {
      priority?: number;
      onProgress?: (progress: number) => void;
      onComplete?: (result: any) => void;
      onError?: (error: Error) => void;
    } = {}
  ): string {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const queueItem: QueueItem = {
      id,
      file,
      priority: options.priority || 0,
      status: 'waiting',
      progress: 0,
      retryCount: 0,
      maxRetries: 3,
      onProgress: options.onProgress,
      onComplete: options.onComplete,
      onError: options.onError
    };

    this.queue.push(queueItem);
    this.sortQueue();
    
    if (!this.isProcessing) {
      this.processQueue();
    }

    return id;
  }

  // Remove file from queue
  removeFile(id: string): boolean {
    const index = this.queue.findIndex(item => item.id === id);
    if (index === -1) return false;

    // Cancel active upload if exists
    const controller = this.activeUploads.get(id);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(id);
    }

    this.queue.splice(index, 1);
    return true;
  }

  // Reorder queue item
  reorderItem(id: string, newPriority: number): boolean {
    const item = this.queue.find(item => item.id === id);
    if (!item || item.status !== 'waiting') return false;

    item.priority = newPriority;
    this.sortQueue();
    return true;
  }

  // Get queue status
  getQueueStatus(): {
    total: number;
    waiting: number;
    uploading: number;
    completed: number;
    error: number;
  } {
    return {
      total: this.queue.length,
      waiting: this.queue.filter(item => item.status === 'waiting').length,
      uploading: this.queue.filter(item => item.status === 'uploading').length,
      completed: this.queue.filter(item => item.status === 'completed').length,
      error: this.queue.filter(item => item.status === 'error').length
    };
  }

  // Get queue items
  getQueueItems(): QueueItem[] {
    return [...this.queue];
  }

  // Clear completed items
  clearCompleted(): void {
    this.queue = this.queue.filter(item => item.status !== 'completed');
  }

  // Retry failed uploads
  retryFailed(): void {
    this.queue
      .filter(item => item.status === 'error')
      .forEach(item => {
        item.status = 'waiting';
        item.progress = 0;
        item.retryCount = 0;
      });
    
    this.sortQueue();
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private sortQueue(): void {
    this.queue.sort((a, b) => {
      // Prioritize by status first (uploading > waiting > error > completed)
      const statusPriority = {
        uploading: 4,
        waiting: 3,
        error: 2,
        completed: 1
      };
      
      const statusDiff = statusPriority[b.status] - statusPriority[a.status];
      if (statusDiff !== 0) return statusDiff;
      
      // Then by priority
      return b.priority - a.priority;
    });
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.queue.some(item => item.status === 'waiting' || item.status === 'error')) {
      const activeCount = this.activeUploads.size;
      
      if (activeCount >= this.maxConcurrentUploads) {
        // Wait for an upload to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      // Find next item to upload
      const nextItem = this.queue.find(item => 
        (item.status === 'waiting' || item.status === 'error') && 
        !this.activeUploads.has(item.id)
      );

      if (!nextItem) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }

      // Start upload
      this.uploadFile(nextItem);
    }

    this.isProcessing = false;
  }

  private async uploadFile(item: QueueItem): Promise<void> {
    const controller = new AbortController();
    this.activeUploads.set(item.id, controller);
    
    item.status = 'uploading';
    item.progress = 0;

    try {
      const startTime = Date.now();
      let lastProgressTime = startTime;
      let lastProgressBytes = 0;

      // Simulate upload with progress tracking
      const result = await this.simulateUpload(item.file, {
        signal: controller.signal,
        onProgress: (progress: number, bytesUploaded: number) => {
          item.progress = progress;
          
          // Calculate upload speed
          const currentTime = Date.now();
          const timeDiff = currentTime - lastProgressTime;
          
          if (timeDiff > 1000) { // Update speed every second
            const bytesDiff = bytesUploaded - lastProgressBytes;
            item.uploadSpeed = (bytesDiff / timeDiff) * 1000; // bytes per second
            
            // Calculate estimated time
            const remainingBytes = item.file.size - bytesUploaded;
            item.estimatedTime = remainingBytes / item.uploadSpeed;
            
            lastProgressTime = currentTime;
            lastProgressBytes = bytesUploaded;
          }
          
          item.onProgress?.(progress);
        }
      });

      item.status = 'completed';
      item.progress = 100;
      item.onComplete?.(result);
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Upload was cancelled
        item.status = 'waiting';
        item.progress = 0;
      } else {
        item.retryCount++;
        
        if (item.retryCount <= item.maxRetries) {
          item.status = 'waiting';
          item.progress = 0;
          // Add delay before retry
          setTimeout(() => {
            if (!this.isProcessing) {
              this.processQueue();
            }
          }, Math.pow(2, item.retryCount) * 1000); // Exponential backoff
        } else {
          item.status = 'error';
          item.onError?.(error as Error);
        }
      }
    } finally {
      this.activeUploads.delete(item.id);
    }
  }

  private async simulateUpload(
    file: File, 
    options: {
      signal?: AbortSignal;
      onProgress?: (progress: number, bytesUploaded: number) => void;
    }
  ): Promise<any> {
    const totalSize = file.size;
    let uploadedSize = 0;
    
    // Simulate upload in chunks
    const chunkSize = Math.max(totalSize / 100, 1024); // At least 1KB chunks
    
    while (uploadedSize < totalSize) {
      if (options.signal?.aborted) {
        throw new Error('Upload aborted');
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      uploadedSize = Math.min(uploadedSize + chunkSize, totalSize);
      const progress = (uploadedSize / totalSize) * 100;
      
      options.onProgress?.(progress, uploadedSize);
    }
    
    // Return mock result
    return {
      id: `upload-${Date.now()}`,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type
    };
  }
}

export const uploadQueue = new UploadQueue();