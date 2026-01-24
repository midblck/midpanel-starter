# MediaPicker Field

The MediaPicker field is a simplified media selection component that supports file uploads and YouTube videos.

## Features

### Supported Media Types

- **File Upload**: Local file uploads via Payload CMS
- **YouTube Video**: YouTube video URLs (automatically converted to embed format)

### Supported Media Types

#### File Upload

- Upload files directly through Payload CMS media library

#### YouTube Videos

- Standard YouTube URLs: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short YouTube URLs: `https://youtu.be/VIDEO_ID`
- URLs are automatically converted to embed format

## Usage

```typescript
import { MediaPickerField } from '@/fields/mediaPicker'

// Basic usage
const mediaField = MediaPickerField()

// With custom overrides
const customMediaField = MediaPickerField({
  name: 'heroImage',
  label: 'Hero Image',
  admin: {
    description: 'Select or upload your hero image',
  },
})
```

## How It Works

### File Upload

- Files are uploaded through Payload CMS and stored in the media collection

### YouTube Video Conversion

- YouTube URLs are automatically converted to embed format for proper display
- Supports various YouTube URL formats (youtu.be, youtube.com/watch)

### Validation

- YouTube URL format validation
- Automatic conversion to embed URLs before saving

### Hooks

- `convertYoutubeUrlHook`: YouTube URL conversion to embed format

## File Structure

```
src/lib/fields/media-picker/
├── index.ts                    # Main MediaPicker field component
├── hooks/
│   └── convertYoutubeUrlHook.ts # YouTube URL conversion and validation
└── README.md                   # This documentation
```

## Examples

### Valid YouTube URLs

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://youtube.com/watch?v=dQw4w9WgXcQ
```

### Invalid YouTube URLs

```
https://youtube.com/channel/UC1234567890  # Channel URL, not video
https://vimeo.com/123456789              # Not YouTube
https://example.com/video.mp4            # Not YouTube
```

## Error Messages

The validation provides specific error messages for YouTube URLs:

- **YouTube**: Supported URL formats and examples
- Invalid YouTube URLs will show format requirements and examples

## Dependencies

- `payload`: Core CMS functionality
- Built-in browser APIs: `URL` constructor

## Notes

- YouTube URLs are converted using pattern matching
- All conversions happen before validation and saving
- The field automatically shows relevant fields based on the selected media type
