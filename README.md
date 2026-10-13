# QA Automation Playwright

Projeto de automação de testes de API com Playwright e TypeScript.

## Objetivo

Validar fluxos de autenticação e reservas de um serviço REST, garantindo que as operações principais (criação, consulta e manipulação de dados) funcionem corretamente.

## Stack

- Playwright Test
- TypeScript
- dotenv
- Node.js

## Estrutura do projeto

```text
QA-Automation-Playwright/
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── src/
│   ├── clients/
│   │   ├── AuthApi.ts
│   │   └── BookingAPI.ts
│   └── data/
│       └── bookingFactory.ts
├── tests/
│   ├── auth.spec.ts
│   ├── booking-crud.spec.ts
│   ├── booking-management.spec.ts
│   └── fixtures.ts
├── tsconfig.json
└── README.md
```

## Pré-requisitos

- Node.js 18+
- npm
- Acesso ao ambiente da API testada

## Instalação

```bash
npm install
```

## Configuração de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` e configure as variáveis necessárias, por exemplo:

```env
BASE_URL=https://restful-booker.herokuapp.com
```

A configuração do Playwright usa `dotenv` para carregar essas variáveis automaticamente.

## Execução dos testes

Executar todos os testes:

```bash
npm test
```

Executar especificamente os testes de API:

```bash
npm run test:api
```

Abrir o relatório HTML gerado pelo Playwright:

```bash
npm run test:report
```

## Casos cobertos

- Criação e consulta de reservas
- Pesquisa de reservas por primeiro nome
- Autenticação válida e rejeição de credenciais inválidas
- Substituição completa (PUT) e atualização parcial (PATCH) de reservas
- Eliminação de reservas e confirmação de que deixaram de estar disponíveis
- Estrutura reutilizável de dados de reserva via factory

Os testes de atualização e eliminação usam as credenciais de demonstração do
Restful Booker (`admin` / `password123`) e removem as reservas criadas durante
a execução.

## Observações

O projeto foi organizado para separar:

- clientes da API em `src/clients`
- dados mockados e builders em `src/data`
- fixtures partilhadas e limpeza dos dados de teste em `tests/fixtures.ts`
- cenários em `tests/`
- configuração global em `playwright.config.ts`

Este padrão facilita manutenção, reutilização e expansão dos testes.
