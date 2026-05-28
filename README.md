# FLUX Extension

<p align="center">
  <img src="flux_app_icon_128_transparent.png" alt="FLUX Extension Logo" height="128">
</p>

FLUX Extension is a powerful, secure browser sidebar utility that enables you to convert files directly on your device instead of uploading them to a third-party cloud. All image, audio, document, and video processing is done completely locally using WebAssembly, ensuring maximum speed, zero file size limits, and absolute privacy.

This extension is built utilizing the modern WXT browser extension framework combined with Svelte 5 and TypeScript.

---

## 🌟 Key Features

* **100% On-Device Conversion**: All file processing happens locally in your browser via WebAssembly (ImageMagick, Pandoc, and FFmpeg). Your files never leave your device.
* **No Size Limits & No Ads**: Unlike cloud converters, FLUX does not limit your file sizes or bombard you with intrusive ads.
* **250+ Formats Supported**: Easily convert images, audio formats, documents, and video files.
* **Convenient Browser Integration**: Access the side panel directly from your browser, or right-click any image/file and select "Convert with FLUX" to get started instantly.
* **Advanced Conversion Customization**: Fine-tune output quality, sample rate, filename formats, and choose whether to preserve metadata.
* **Multilingual Interface**: Full translation support for 15 languages (English, Spanish, French, German, Italian, Bosnian, Croatian, Turkish, Japanese, Korean, Greek, Indonesian, Simplified Chinese, Traditional Chinese, and Portuguese).
* **Support Integration**: Built-in direct support contact form to send logs and user feedback securely via offline script webhook.

---

## 🚀 Getting Started

### Prerequisites

You need [Node.js](https://nodejs.org/) installed on your machine to build and run this extension.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/flux-sh/flux-extension.git
   cd flux-extension
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Development

To start developing the extension in watch mode (hot-reloading for Chrome):
```bash
npm run dev
```

For Firefox development:
```bash
npm run dev:firefox
```

This will spin up a development browser instance with the extension pre-loaded automatically.

### Production Build & Packaging

To compile the production bundles:
```bash
npm run build
```

To build and package the extension into a ready-to-upload `.zip` file:
```bash
npm run zip
```
The output zip file will be generated in the `.output/` directory (e.g., `.output/flux-offline-file-converter-1.1.0-chrome.zip`).

---

## ⚖️ License & Open Source

This project is licensed under the **GNU GPLv3 License** (GNU General Public License v3.0). 

FLUX Extension is an open-source project that utilizes and extends code from the [VERT](https://github.com/vert-sh/vert) project under the copyleft terms of the GPLv3 license. You can view the full terms and details in the [LICENSE](LICENSE) file.
