# Contributing to Infyn

First off, thank you for considering contributing to Infyn! It's people like you that make open-source software such a fantastic community to learn, inspire, and create.

We welcome all contributions: bug reports, feature requests, documentation improvements, and pull requests!

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to the project maintainers.

## 💡 How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Check if a similar issue already exists before opening a new one.

### Suggesting Features & Tools
Have an idea for a new in-browser utility? We'd love to hear it! Open an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Keep in mind our core principles: zero cloud uploads, privacy-first, and ad-free.

### Good First Issues
If you're looking for a place to start, check out the issues labeled `good first issue` or `help wanted`. These are specifically chosen to be accessible to new contributors.

## 🛠️ Development Workflow

1. **Fork the repository** to your own GitHub account.
2. **Clone the project** to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/infyn.git
   cd infyn
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes** and commit them using descriptive messages.
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Submit a Pull Request** via GitHub.

## 🧩 Adding a New Tool

Infyn uses a highly modular architecture. If you're building a new tool:

1. **Client-Side Only:** Ensure your tool processes everything locally. Use Web Workers (`worker.ts`) or WebAssembly for heavy computations to avoid freezing the main thread.
2. **Use Shared Components:** Reuse our design system components located in `src/components/image-tools/` (e.g., `<DropZone />`, `<ProgressBar />`, `<PrivacyBadges />`).
3. **Follow the Standard Flow:**
   - **Idle:** Clean upload screen.
   - **Busy:** Animated processing state.
   - **Done:** Results with a "Download As-Is" or batch download button.
   - **Error:** Clear error messaging.
4. **Register the Tool:** Don't forget to add your new tool to the `TOOLS` array in `src/app/page.tsx` and the corresponding category hub (e.g., `src/app/image/page.tsx`).

## 🎨 Style Guidelines

- We use TailwindCSS for styling. Please stick to our minimal "Cream & Ink" aesthetic (mostly `#111111`, `#6E6D68`, `#FBFBFA`).
- Avoid adding unnecessary animations or heavy third-party dependencies unless strictly required for functionality.
- Keep the UI uncluttered.

Thank you for contributing to making the web a faster, more private place!
