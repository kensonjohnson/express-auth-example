# Express Auth Example

This is a small example on how to setup traditional email/password authentication.
The setup shown here is rather minimal, and should only serve to learn about auth.
Production apps should use more secure methods than password authentication.

## Features

- TypeScript
- Express
- Postgres
- Docker

## Prerequisites

You will need [Node](https://nodejs.org/en) installed on your computer.
You can find installation instructions for your machine [here](https://nodejs.org/en/download/package-manager).

You will also need [Docker](https://www.docker.com/) installed.  
- Instruction for [Docker Desktop](https://docs.docker.com/get-started/get-docker/).  
- Instructions for [Docker Engine](https://docs.docker.com/engine/install/), (Linux only).

## Quick Start

If you haven't already done so, clone the repository:

```sh
git clone git@github.com:kensonjohnson/express-auth-example.git 
cd express-auth-example
```

Then you can install dependencies with `npm install`

Run the provided helper script: `npm run configure`  
***Note: This only works on Linux and Mac. For Windows, see [Manual Setup](#manual-setup) below.***

Finally, you can run the dev server with `npm run dev`

## Manual Setup

1. If you haven't already done so, clone the repository:

```sh
git clone git@github.com:kensonjohnson/express-auth-example.git 
cd express-auth-example
```

2. Install dependencies:
```sh
npm install
```

3. Create database container:
```sh
docker-compose up -d
```

4. Create env file:
```sh
cp .env.example .env
```

5. Run the development server:
```sh
npm run dev
```

## Usage

TBD
