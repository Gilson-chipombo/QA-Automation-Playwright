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
├── .github/
│   └── workflows/
│       └── .api-tests.yml
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── src/
│   ├── clients/
│   │   ├── AuthApi.ts
│   │   └── BookingAPI.ts
│   ├── data/
│   │   └── bookingFactory.ts
│   └── fixtures.ts
├── tests/
│   ├── auth.spec.ts
│   ├── booking.spec.ts
│   └── booking-management.spec.ts
├── tsconfig.json
└── README.md
```

- `src/clients/`: wrappers tipados para os endpoints da API.
- `src/data/`: factories e dados reutilizáveis para os testes.
- `src/fixtures.ts`: fixtures Playwright partilhadas (clientes da API,
  credenciais/token e criação/limpeza de reservas).
- `tests/`: cenários de autenticação e reservas; os ficheiros `*.spec.ts`
  são descobertos e executados pelo Playwright.
- `.github/workflows/`: execução automática da suite no GitHub Actions.

## Pré-requisitos

- Node.js 22 (a versão usada no CI)
- npm
- Acesso ao ambiente da API testada

## Instalação

```bash
npm ci
```

## Configuração de ambiente

Crie um ficheiro `.env` na raiz do projeto com base no `.env.example`:

```env
BASE_URL=https://restful-booker.herokuapp.com
AUTH_USERNAME=admin
AUTH_PASSWORD=password123
```

O Playwright carrega o `.env` automaticamente. Se `BASE_URL` não estiver definida
ou estiver vazia, é usado `https://restful-booker.herokuapp.com`. As credenciais
são lidas de `AUTH_USERNAME` e `AUTH_PASSWORD`; por omissão, são `admin` e
`password123`, credenciais públicas do serviço de demonstração. Para outro
ambiente, define as variáveis localmente ou configura `BASE_URL` como variável e
`AUTH_USERNAME`/`AUTH_PASSWORD` como secrets no GitHub Actions.

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

Verificar os tipos TypeScript:

```bash
npx tsc --noEmit
```

## Integração contínua

O workflow `.github/workflows/.api-tests.yml` instala as dependências com
`npm ci` e executa `npm run test:api` em pull requests e em pushes para `main`.
O relatório HTML e os resultados de teste são carregados como artefactos quando
existirem.

## Casos cobertos

- Criação e consulta de reservas
- Pesquisa de reservas por primeiro nome
- Autenticação válida e rejeição de credenciais inválidas
- Substituição completa (PUT) e atualização parcial (PATCH) de reservas
- Eliminação de reservas e confirmação de que deixaram de estar disponíveis
- Estrutura reutilizável de dados de reserva via factory

Os testes que criam reservas usam a fixture partilhada de `src/fixtures.ts`,
que remove a reserva no final de cada teste, mesmo quando ocorre uma falha.

## Observações

O projeto foi organizado para separar:

- clientes da API em `src/clients`
- factories de dados em `src/data`
- fixtures partilhadas e limpeza dos dados de teste em `src/fixtures.ts`
- cenários em `tests/`
- configuração global em `playwright.config.ts`

Os testes verificam uma API externa, por isso precisam de ligação à rede e o
serviço de demonstração pode estar temporariamente indisponível ou limitar
pedidos.
