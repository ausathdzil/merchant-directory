# Veteran Market API

## Getting Started

Install uv:

```bash
pip install uv
```

Create and activate virtual environments:

```bash
uv venv
```

```bash
# Linux, macOS
source .venv\bin\activate

# Windows PowerShell
.venv\Scripts\Activate.ps1

# Windows bash
source .venv/Scripts/activate
```

Install dependencies:

```bash
uv sync
```

Run the development server:

```bash
uvicorn server:app --reload
```
