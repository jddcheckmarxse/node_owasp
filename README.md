# node_owasp

Common OWASP issues to watch for in Node.js applications:

1. **Broken Access Control**
   - Missing authorization checks on routes or resources.
   - Prevent with server-side role/ownership validation on every protected action.

2. **Cryptographic Failures**
   - Storing sensitive data in plain text or using weak hashing.
   - Prevent with strong algorithms (bcrypt/Argon2, AES-GCM), proper key management, and HTTPS.

3. **Injection**
   - SQL/NoSQL/command injection from unsanitized user input.
   - Prevent with parameterized queries, strict input validation, and avoiding shell command concatenation.

4. **Insecure Design**
   - Security not considered in architecture (e.g., no rate limits, no abuse controls).
   - Prevent with threat modeling and security requirements early in design.

5. **Security Misconfiguration**
   - Default settings, verbose errors, open CORS, missing security headers.
   - Prevent with hardened production configs and tools like `helmet`.

6. **Vulnerable and Outdated Components**
   - Dependencies with known CVEs.
   - Prevent with regular updates and dependency scanning (`npm audit`, SCA tools).

7. **Identification and Authentication Failures**
   - Weak session handling, poor password policy, missing MFA.
   - Prevent with secure session/token management and strong auth controls.

8. **Software and Data Integrity Failures**
   - Untrusted plugins, insecure CI/CD, unsigned artifacts.
   - Prevent with trusted registries, integrity checks, and protected pipelines.

9. **Security Logging and Monitoring Failures**
   - Missing audit logs or no alerting on suspicious activity.
   - Prevent with centralized logging, tamper resistance, and actionable monitoring.

10. **Server-Side Request Forgery (SSRF)**
    - Server fetches attacker-controlled URLs.
    - Prevent with allowlists, URL validation, and network egress restrictions.
