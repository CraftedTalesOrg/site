import type { R2Bucket } from '@cloudflare/workers-types';
import { ALLOWED_IMAGE_TYPES, ALLOWED_MOD_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE } from '../features/_shared/common.schemas';

/**
 * File upload utilities for R2
 */

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface UploadValidation {
  maxSize: number;
  allowedTypes: string[];
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  validation: UploadValidation,
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > validation.maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${Math.round(validation.maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check MIME type
  if (!validation.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${validation.allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Upload file to R2 bucket
 */
export async function uploadToR2(
  bucket: R2Bucket,
  file: File,
  keyPrefix: string,
): Promise<UploadResult> {
  // Generate unique key
  const ext = file.name.split('.').pop();
  const key = `${keyPrefix}/${crypto.randomUUID()}.${ext}`;

  // Upload to R2
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  // Return upload result
  return {
    key,
    // TODO: Update with actual R2 public URL or custom domain
    url: `https://r2.craftedtales.com/${key}`,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Delete file from R2 bucket
 */
export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

/**
 * Validation presets for different file types
 */
export const FILE_VALIDATIONS = {
  IMAGE: {
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
  },
  MOD: {
    maxSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_MOD_TYPES,
  },
} as const;
