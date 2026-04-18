# CHODE Independent Question Authorship Test — 2026-04-18

> §16.4 item 9 response: questions authored by AI models that never saw the CHODE profile.
> Author model ≠ evaluator model. Round-robin assignment across 3 repos.

---

## Assignment

| Repo | Author Model | Evaluator Model |
|---|---|---|
| appwrite | openai/gpt-4o | google/gemini-2.5-flash |
| mermaid | openai/gpt-4o | google/gemini-2.5-flash |
| scala3 | openai/gpt-4o | google/gemini-2.5-flash |
| dagger | google/gemini-2.5-flash | mistralai/mistral-large-2512 |
| pocketbase | google/gemini-2.5-flash | mistralai/mistral-large-2512 |
| gin | google/gemini-2.5-flash | mistralai/mistral-large-2512 |
| ladybird | mistralai/mistral-large-2512 | openai/gpt-4o |
| ktor | mistralai/mistral-large-2512 | openai/gpt-4o |
| hono | mistralai/mistral-large-2512 | openai/gpt-4o |

---

## Summary

| Repo | Baseline | CHODE | Δ |
|---|---|---|---|
| appwrite | 50% | 0% | -50pp |
| mermaid | 42% | 0% | -42pp |
| scala3 | 92% | 0% | -92pp |
| dagger | 75% | 0% | -75pp |
| pocketbase | 75% | 0% | -75pp |
| gin | 67% | 8% | -59pp |
| ladybird | 58% | 8% | -50pp |
| ktor | 58% | 0% | -58pp |
| hono | 8% | 0% | -8pp |
| **Overall** | **58%** | **2%** | **-56pp** |

---

## appwrite

**Author:** openai/gpt-4o  
**Evaluator:** google/gemini-2.5-flash

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the default port number used by Appwrite when running in a containerized environment? | port, 20080 | 20080 |
| Q2 | Which command is used to start the Appwrite installation on a Unix system? | docker, install | `docker run -it --rm --publish 20080:20080 --volume /var/run/docker.sock:/var/ru |
| Q3 | What is the name of the Appwrite product that provides serverless compute capabilities? | functions, serverless | Appwrite Functions |
| Q4 | Which cloud provider is NOT listed as a one-click setup option for Appwrite? | google | Google Cloud |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | port | 80 (for HTTP) and 443 (for HTTPS). While Appwrite itself mig… | 1/3 | Not in profile. | 0/3 |
| Q2 | docker | `docker-compose up -d` (or `docker compose up -d` for newer … | 1/3 | Not in profile. | 0/3 |
| Q3 | functions | Appwrite Functions. | 1/3 | Not in profile. | 0/3 |
| Q4 | google | While Appwrite aims for broad compatibility, based on common… | 3/3 | Not in profile. | 0/3 |

**Baseline: 50% | CHODE: 0% | Δ: -50pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:  
What is the default port number used by Appwrite when running in a containerized environment?  
ANSWER: 20080  
MUST: port, 20080  
GOOD: containerized

Q2:  
Which command is used to start the Appwrite installation on a Unix system?  
ANSWER: `docker run -it --rm --publish 20080:20080 --volume /var/run/docker.sock:/var/run/docker.sock --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw --entrypoint="install" appwrite/appwrite:1.9.1`  
MUST: docker, install  
GOOD: unix

Q3:  
What is the name of the Appwrite product that provides serverless compute capabilities?  
ANSWER: Appwrite Functions  
MUST: functions, serverless  
GOOD: compute

Q4:  
Which cloud provider is NOT listed as a one-click setup option for Appwrite?  
ANSWER: Google Cloud  
MUST: google  
GOOD: one-click
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
80 (for HTTP) and 443 (for HTTPS). While Appwrite itself might run on an internal port within the container, these are the ports exposed and typically used to access Appwrite from outside the container.

Q2:
`docker-compose up -d` (or `docker compose up -d` for newer Docker Compose versions). Appwrite is primarily deployed using Docker, and this command starts the services defined in its `docker-compose.yml` file.

Q3:
Appwrite Functions.

Q4:
While Appwrite aims for broad compatibility, based on common one-click deployment offerings for similar tools, I would guess **Oracle Cloud Infrastructure (OCI)**. Common one-click options usually include AWS, Google Cloud, DigitalOcean, and sometimes Azure or Vultr. OCI is less frequently seen as a primary one-click target for open-source projects compared to the others.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1:
Not in profile.
Q2:
Not in profile.
Q3:
Not in profile.
Q4:
Not in profile.
```

</details>

---

## mermaid

**Author:** openai/gpt-4o  
**Evaluator:** google/gemini-2.5-flash

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What command is used to publish the Mermaid package to npm? | npm, publish | npm publish |
| Q2 | Where can you find the Mermaid Live Editor for trying out future releases? | develop | https://develop.git.mermaid.live/ |
| Q3 | Which service powers the PR Visual Regression Testing for Mermaid? | argos, testing | Argos |
| Q4 | What is the email address to report a vulnerability in Mermaid? | security | security@mermaid.live |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | npm | Based on common practices for JavaScript projects, the comma… | 2/3 | Not in profile. | 0/3 |
| Q2 | develop | The Mermaid Live Editor is a well-known tool. For trying out… | 0/3 | Not in profile. | 0/3 |
| Q3 | argos | Mermaid is a popular open-source project. For visual regress… | 1/3 | Not in profile. | 0/3 |
| Q4 | security | For reporting vulnerabilities in open-source projects, it's … | 2/3 | Not in profile. | 0/3 |

**Baseline: 42% | CHODE: 0% | Δ: -42pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What command is used to publish the Mermaid package to npm?
ANSWER: npm publish
MUST: npm, publish
GOOD: dist, folder

Q2:
Where can you find the Mermaid Live Editor for trying out future releases?
ANSWER: https://develop.git.mermaid.live/
MUST: develop
GOOD: next

Q3:
Which service powers the PR Visual Regression Testing for Mermaid?
ANSWER: Argos
MUST: argos, testing
GOOD: visual

Q4:
What is the email address to report a vulnerability in Mermaid?
ANSWER: security@mermaid.live
MUST: security
GOOD: vulnerability
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
Based on common practices for JavaScript projects, the command to publish a package to npm is usually `npm publish`.

Q2:
The Mermaid Live Editor is a well-known tool. For trying out future releases, it's common for projects to have a "dev" or "beta" version of their live editor. I would guess you could find it at a URL like `https://mermaid.live/dev` or `https://mermaid.live/beta`, or perhaps there's a specific branch or version selector within the main live editor.

Q3:
Mermaid is a popular open-source project. For visual regression testing, common services include Percy.io, Chromatic, or Storybook's own visual testing features. Given its popularity and the need for robust testing, Percy.io is a strong candidate.

Q4:
For reporting vulnerabilities in open-source projects, it's standard practice to have a dedicated security email address, often in the format `security@projectname.com` or `security@organization.com`. For Mermaid, I would guess `security@mermaidjs.github.io` or `security@mermaid-js.github.io` or perhaps a more general `security@mermaid.live`.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1:
Not in profile.
Q2:
Not in profile.
Q3:
Not in profile.
Q4:
Not in profile.
```

</details>

---

## scala3

**Author:** openai/gpt-4o  
**Evaluator:** google/gemini-2.5-flash

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | How do you build a local distribution of Scala 3? | sbt, packagebin | sbt dist/Universal/packageBin |
| Q2 | Where can you find the newly-built distributions after building Scala 3 locally? | dist/target/ | dist/target/ |
| Q3 | What code of conduct does the Scala 3 project adhere to? | scala, conduct | Scala Code of Conduct |
| Q4 | Under what license is Scala 3 distributed? | apache | Apache License Version 2.0 |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | sbt | To build a local distribution of Scala 3, you would typicall… | 3/3 | Not in profile. | 0/3 |
| Q2 | dist/target/ | After building Scala 3 locally, the newly-built distribution… | 3/3 | Not in profile. | 0/3 |
| Q3 | scala | Based on general knowledge of open-source projects, especial… | 2/3 | Not in profile. | 0/3 |
| Q4 | apache | Scala 3, like previous versions of Scala, is distributed und… | 3/3 | Not in profile. | 0/3 |

**Baseline: 92% | CHODE: 0% | Δ: -92pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
How do you build a local distribution of Scala 3?
ANSWER: sbt dist/Universal/packageBin
MUST: sbt, packageBin
GOOD: dist

Q2:
Where can you find the newly-built distributions after building Scala 3 locally?
ANSWER: dist/target/
MUST: dist/target/
GOOD:

Q3:
What code of conduct does the Scala 3 project adhere to?
ANSWER: Scala Code of Conduct
MUST: Scala, Conduct
GOOD: Dotty

Q4:
Under what license is Scala 3 distributed?
ANSWER: Apache License Version 2.0
MUST: Apache
GOOD: Version 2.0
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
To build a local distribution of Scala 3, you would typically clone the repository and then use a build tool like sbt. The common command would be `sbt dist/pack` or `sbt dist/universal:packageBin`. This command compiles the project and then packages it into a distributable format.

Q2:
After building Scala 3 locally, the newly-built distributions are usually found in a `target` directory within the project's root or a specific subproject's `target` directory. For `dist/pack` or `dist/universal:packageBin`, you'd often find them under `dist/target/universal` or a similar path, containing archives like `.zip` or `.tgz` files.

Q3:
Based on general knowledge of open-source projects, especially those within the Scala ecosystem, the Scala 3 project likely adheres to a widely accepted code of conduct. A very common one is the Contributor Covenant. While I don't have the exact file in front of me, this is a strong guess for a project of this size and community.

Q4:
Scala 3, like previous versions of Scala, is distributed under the **Apache License, Version 2.0**. This is a permissive free software license that allows users to use, modify, and distribute the software under certain conditions, primarily requiring attribution and preservation of copyright and patent notices.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1: Not in profile.
Q2: Not in profile.
Q3: Not in profile.
Q4: Not in profile.
```

</details>

---

## dagger

**Author:** google/gemini-2.5-flash  
**Evaluator:** mistralai/mistral-large-2512

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the specific command to install Dagger using Homebrew? | brew, install, dagger/tap/dagger | brew install dagger/tap/dagger |
| Q2 | How many different programming languages currently have native SDKs for Dagger? | 8 | 8 |
| Q3 | What is the name of the specific file that contains contribution guidelines for the Dagger project? | contributing.md | CONTRIBUTING.md |
| Q4 | What is the primary open-source observability standard that Dagger uses for emitting traces? | opentelemetry | OpenTelemetry |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | brew | The specific command to install Dagger using Homebrew is: `b… | 3/3 | Not in profile. | 0/3 |
| Q2 | 8 | As of my knowledge cutoff (October 2023), Dagger has native … | 0/3 | Not in profile. | 0/3 |
| Q3 | contributing.md | The file containing contribution guidelines for the Dagger p… | 3/3 | Not in profile. | 0/3 |
| Q4 | opentelemetry | The primary open-source observability standard that Dagger u… | 3/3 | Not in profile. | 0/3 |

**Baseline: 75% | CHODE: 0% | Δ: -75pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What is the specific command to install Dagger using Homebrew?
ANSWER: brew install dagger/tap/dagger
MUST: brew, install, dagger/tap/dagger
GOOD:

Q2:
How many different programming languages currently have native SDKs for Dagger?
ANSWER: 8
MUST: 8
GOOD: languages, sdks

Q3:
What is the name of the specific file that contains contribution guidelines for the Dagger project?
ANSWER: CONTRIBUTING.md
MUST: contributing.md
GOOD: file, guidelines

Q4:
What is the primary open-source observability standard that Dagger uses for emitting traces?
ANSWER: OpenTelemetry
MUST: opentelemetry
GOOD: traces, standard
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
The specific command to install Dagger using Homebrew is:
`brew install dagger/tap/dagger`

Q2:
As of my knowledge cutoff (October 2023), Dagger has native SDKs for **4 programming languages**: Go, Python, Node.js (JavaScript/TypeScript), and Java. There may be additional SDKs or updates since then.

Q3:
The file containing contribution guidelines for the Dagger project is typically named **`CONTRIBUTING.md`**.

Q4:
The primary open-source observability standard that Dagger uses for emitting traces is **OpenTelemetry**.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.

Q2
Not in profile.

Q3
Not in profile.

Q4
Not in profile.
```

</details>

---

## pocketbase

**Author:** google/gemini-2.5-flash  
**Evaluator:** mistralai/mistral-large-2512

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the specific file path for the base example application that the prebuilt executables are based on? | examples, base, main.go | `examples/base/main.go` |
| Q2 | Which specific Go package provides the core functionalities for handling events like `OnServe` in a custom PocketBase application? | core | `github.com/pocketbase/pocketbase/core` |
| Q3 | What is the exact command used to build a statically linked executable for a custom PocketBase application? | cgo_enabled=0, go build | `CGO_ENABLED=0 go build` |
| Q4 | What is the minimum required Go version to install for using PocketBase as a Go framework? | 1.25+ | Go 1.25+ |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | examples | The base example application for PocketBase's prebuilt execu… | 3/3 | Not in profile. | 0/3 |
| Q2 | core | The core functionalities for handling events like `OnServe` … | 3/3 | Not in profile. | 0/3 |
| Q3 | cgo_enabled=0 | The exact command to build a statically linked executable fo… | 3/3 | Not in profile. | 0/3 |
| Q4 | 1.25+ | The minimum required Go version to install for using PocketB… | 0/3 | Not in profile. | 0/3 |

**Baseline: 75% | CHODE: 0% | Δ: -75pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What is the specific file path for the base example application that the prebuilt executables are based on?
ANSWER: `examples/base/main.go`
MUST: examples, base, main.go
GOOD: file

Q2:
Which specific Go package provides the core functionalities for handling events like `OnServe` in a custom PocketBase application?
ANSWER: `github.com/pocketbase/pocketbase/core`
MUST: core
GOOD: github, pocketbase

Q3:
What is the exact command used to build a statically linked executable for a custom PocketBase application?
ANSWER: `CGO_ENABLED=0 go build`
MUST: cgo_enabled=0, go build
GOOD: statically linked

Q4:
What is the minimum required Go version to install for using PocketBase as a Go framework?
ANSWER: Go 1.25+
MUST: 1.25+
GOOD: go
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
The base example application for PocketBase's prebuilt executables is typically found in the `examples/base` directory of the repository. The main file is `main.go` within that path.

Q2:
The core functionalities for handling events like `OnServe` in a custom PocketBase application are provided by the `github.com/pocketbase/pocketbase` package, specifically through the `core` subpackage (e.g., `github.com/pocketbase/pocketbase/core`).

Q3:
The exact command to build a statically linked executable for a custom PocketBase application is:
```sh
CGO_ENABLED=0 go build -tags netgo -ldflags '-w -extldflags "-static"'
```

Q4:
The minimum required Go version to install for using PocketBase as a Go framework is **Go 1.20** (as of the latest stable releases). Earlier versions may not support all dependencies.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.

Q2
Not in profile.

Q3
Not in profile.

Q4
Not in profile.
```

</details>

---

## gin

**Author:** google/gemini-2.5-flash  
**Evaluator:** mistralai/mistral-large-2512

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the minimum Go version required to use Gin? | go, 1.25 | Go version 1.25 or above |
| Q2 | Which specific routing library does Gin use for its high performance? | httprouter | httprouter |
| Q3 | What is the file path for the comprehensive quick start guide mentioned in the "Next Steps" section? | docs/doc.md, quick start guide | docs/doc.md |
| Q4 | What is the name of the official middleware collection for Gin? | gin-contrib | gin-contrib |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | go | The minimum Go version required to use Gin is **Go 1.13** (a… | 1/3 | 1.25 or above | 1/3 |
| Q2 | httprouter | Gin uses its own **custom high-performance HTTP router**, wh… | 3/3 | Not in profile | 0/3 |
| Q3 | docs/doc.md | The comprehensive quick start guide is typically found at **… | 1/3 | Not in profile | 0/3 |
| Q4 | gin-contrib | The name of the official middleware collection for Gin is **… | 3/3 | Not in profile | 0/3 |

**Baseline: 67% | CHODE: 8% | Δ: -59pp**

<details>
<summary>Question generation — raw response</summary>

```
Q1:
What is the minimum Go version required to use Gin?
ANSWER: Go version 1.25 or above
MUST: go, 1.25
GOOD: version, above

Q2:
Which specific routing library does Gin use for its high performance?
ANSWER: httprouter
MUST: httprouter
GOOD:

Q3:
What is the file path for the comprehensive quick start guide mentioned in the "Next Steps" section?
ANSWER: docs/doc.md
MUST: docs/doc.md, quick start guide
GOOD: comprehensive

Q4:
What is the name of the official middleware collection for Gin?
ANSWER: gin-contrib
MUST: gin-contrib
GOOD: official, middleware
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
The minimum Go version required to use Gin is **Go 1.13** (as of recent versions). Earlier versions of Gin may have supported older Go versions, but the project now typically aligns with supported Go releases.

Q2:
Gin uses its own **custom high-performance HTTP router**, which is inspired by `httprouter` but optimized further for Gin's use case. It does not rely on an external routing library.

Q3:
The comprehensive quick start guide is typically found at **`/examples/`** or **`/docs/`** in the repository, but the most likely path for the "Next Steps" section would be:
**`/docs/quickstart.md`** or **`/examples/basic/`** (if referring to code examples).

Q4:
The name of the official middleware collection for Gin is **`gin-contrib`** (hosted at [github.com/gin-contrib](https://github.com/gin-contrib)). Popular middleware like `cors`, `zap`, and `gzip` are part of this collection.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
1.25 or above

Q2
Not in profile

Q3
Not in profile

Q4
Not in profile
```

</details>

---

## ladybird

**Author:** mistralai/mistral-large-2512  
**Evaluator:** openai/gpt-4o

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the name of the JavaScript engine used by Ladybird? | libjs | LibJS |
| Q2 | Which file contains the detailed issue-reporting guidelines for Ladybird? | issues.md | ISSUES.md |
| Q3 | What is the name of the process responsible for handling network connections in Ladybird’s multi-process architecture? | requestserver, process | RequestServer process |
| Q4 | Under which license is Ladybird released? | bsd | 2-clause BSD license |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | libjs | The JavaScript engine used by Ladybird is likely "LibJS," wh… | 3/3 | Not in profile. | 0/3 |
| Q2 | issues.md | The file containing detailed issue-reporting guidelines for … | 0/3 | Not in profile. | 0/3 |
| Q3 | requestserver | The process responsible for handling network connections in … | 1/3 | RequestServer | 1/3 |
| Q4 | bsd | Ladybird is likely released under the BSD 2-Clause License, … | 3/3 | Not in profile. | 0/3 |

**Baseline: 58% | CHODE: 8% | Δ: -50pp**

<details>
<summary>Question generation — raw response</summary>

```
Here are four stump questions based on the Ladybird README:

---

Q1:
What is the name of the JavaScript engine used by Ladybird?
ANSWER: LibJS
MUST: libjs
GOOD:

---

Q2:
Which file contains the detailed issue-reporting guidelines for Ladybird?
ANSWER: ISSUES.md
MUST: issues.md
GOOD:

---

Q3:
What is the name of the process responsible for handling network connections in Ladybird’s multi-process architecture?
ANSWER: RequestServer process
MUST: requestserver, process
GOOD: requests

---

Q4:
Under which license is Ladybird released?
ANSWER: 2-clause BSD license
MUST: bsd
GOOD: 2-clause

---
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:  
The JavaScript engine used by Ladybird is likely "LibJS," which is part of the SerenityOS project.

Q2:  
The file containing detailed issue-reporting guidelines for Ladybird is likely "CONTRIBUTING.md" or a similar file like "ISSUE_TEMPLATE.md" in the repository.

Q3:  
The process responsible for handling network connections in Ladybird’s multi-process architecture is likely called "NetworkProcess" or something similar, as this is a common naming convention for such components.

Q4:  
Ladybird is likely released under the BSD 2-Clause License, as this is the license used by the SerenityOS project, which Ladybird is a part of.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.

Q2
Not in profile.

Q3
RequestServer

Q4
Not in profile.
```

</details>

---

## ktor

**Author:** mistralai/mistral-large-2512  
**Evaluator:** openai/gpt-4o

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the exact Maven Central group ID used for Ktor server dependencies in the build.gradle.kts example? | io.ktor | io.ktor |
| Q2 | Which Gradle plugin ID is used to configure the Ktor BOM, run tasks, and deployment in the README example? | io.ktor.plugin | io.ktor.plugin |
| Q3 | What is the default port number used when running the embedded Ktor server in the "Hello, world!" example? | 8080, localhost | 8080 |
| Q4 | What is the exact command shown in the README to run a Ktor application using Gradle? | gradlew run | ./gradlew run |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | io.ktor | io.ktor | 2/3 | Not in profile. | 0/3 |
| Q2 | io.ktor.plugin | io.ktor.plugin | 2/3 | Not in profile. | 0/3 |
| Q3 | 8080 | 8080 | 1/3 | Not in profile. | 0/3 |
| Q4 | gradlew run | /gradlew run | 2/3 | Not in profile. | 0/3 |

**Baseline: 58% | CHODE: 0% | Δ: -58pp**

<details>
<summary>Question generation — raw response</summary>

```
Here are four stump questions based on the Ktor repository's README:

---

Q1:
What is the exact Maven Central group ID used for Ktor server dependencies in the build.gradle.kts example?
ANSWER: io.ktor
MUST: io.ktor
GOOD: mavenCentral

---

Q2:
Which Gradle plugin ID is used to configure the Ktor BOM, run tasks, and deployment in the README example?
ANSWER: io.ktor.plugin
MUST: io.ktor.plugin
GOOD: 3.1.1

---

Q3:
What is the default port number used when running the embedded Ktor server in the "Hello, world!" example?
ANSWER: 8080
MUST: 8080, localhost
GOOD: embeddedServer

---

Q4:
What is the exact command shown in the README to run a Ktor application using Gradle?
ANSWER: ./gradlew run
MUST: gradlew run
GOOD: ./gradlew
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
io.ktor

Q2:
io.ktor.plugin

Q3:
8080

Q4:
./gradlew run
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1
Not in profile.

Q2
Not in profile.

Q3
Not in profile.

Q4
Not in profile.
```

</details>

---

## hono

**Author:** mistralai/mistral-large-2512  
**Evaluator:** openai/gpt-4o

### Generated Questions

| Q | Question | Must terms | GT answer |
|---|---|---|---|
| Q1 | What is the name of the *fastest* router implementation mentioned in the Hono README that avoids linear loops? | regexprouter | RegExpRouter |
| Q2 | What is the exact npm command provided in the README to quickly scaffold a new Hono project? | create hono@latest | npm create hono@latest |
| Q3 | What is the file path (relative to the repo root) where the Hono migration guide is located? | docs/, migration.md | docs/MIGRATION.md |
| Q4 | What is the *minimum* bundle size (in kB) for the `hono/tiny` preset as stated in the README? | 12kb | under 12kB |

### Results

| Q | Topic | Baseline answer | B score | CHODE answer | C score |
|---|---|---|---|---|---|
| Q1 | regexprouter | The fastest router implementation mentioned in the Hono READ… | 0/3 | Not in profile. | 0/3 |
| Q2 | create hono@latest | The exact npm command provided in the README to quickly scaf… | 0/3 | Not in profile. | 0/3 |
| Q3 | docs/ | The file path (relative to the repo root) where the Hono mig… | 1/3 | Not in profile. | 0/3 |
| Q4 | 12kb | The minimum bundle size for the `hono/tiny` preset as stated… | 0/3 | Not in profile. | 0/3 |

**Baseline: 8% | CHODE: 0% | Δ: -8pp**

<details>
<summary>Question generation — raw response</summary>

```
Here are four stump questions based on the Hono repository's README:

---

Q1:
What is the name of the *fastest* router implementation mentioned in the Hono README that avoids linear loops?
ANSWER: RegExpRouter
MUST: regexprouter
GOOD: router, ultrafast

---

Q2:
What is the exact npm command provided in the README to quickly scaffold a new Hono project?
ANSWER: npm create hono@latest
MUST: create hono@latest
GOOD: npm

---

Q3:
What is the file path (relative to the repo root) where the Hono migration guide is located?
ANSWER: docs/MIGRATION.md
MUST: docs/, migration.md
GOOD: migration

---

Q4:
What is the *minimum* bundle size (in kB) for the `hono/tiny` preset as stated in the README?
ANSWER: under 12kB
MUST: 12kb
GOOD: tiny, under
```

</details>

<details>
<summary>Baseline — raw response</summary>

```
Q1:
The fastest router implementation mentioned in the Hono README that avoids linear loops is likely a trie-based router, as these are commonly used for their efficiency in routing.

Q2:
The exact npm command provided in the README to quickly scaffold a new Hono project is likely something like `npm init hono-app` or a similar command, as this is a common pattern for scaffolding new projects.

Q3:
The file path (relative to the repo root) where the Hono migration guide is located might be something like `docs/migration-guide.md`, as documentation files are often stored in a `docs` directory.

Q4:
The minimum bundle size for the `hono/tiny` preset as stated in the README is likely around 1-2 kB, as "tiny" presets are typically optimized for minimal size.
```

</details>

<details>
<summary>CHODE — raw response</summary>

```
Q1  
Not in profile.

Q2  
Not in profile.

Q3  
Not in profile.

Q4  
Not in profile.
```

</details>

---

## Finding

Questions were authored by AI models with no access to the CHODE profile — only the repository README. Across 9 repos with independently authored questions, CHODE scored **2%** vs baseline **58%** (Δ **-56pp**). The gap did not replicate on independently authored questions. This warrants further investigation into authorship bias in the primary benchmark.

Full result file: `benchmarks/results/independent-question-test-20260418-110342.md`
