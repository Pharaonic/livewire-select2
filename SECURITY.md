# Security Policy

## Supported versions

Security fixes are provided for package lines that are currently documented as supported.

## Reporting a vulnerability

Please do **not** open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting / security advisory flow for this repository when available. Include a clear description, affected versions, reproduction details, and expected impact.

Security reports will be reviewed before public disclosure or release notes are prepared.

## Livewire 1

The 1.x line supports Livewire 1, which no longer receives security fixes. CVE-2024-47823 (remote code execution through file uploads) affects every Livewire release before 2.12.7, including all of Livewire 1. This package does not use Livewire file uploads, but applications that do should upgrade Livewire.
