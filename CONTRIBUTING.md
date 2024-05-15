# Code review
Atenção: Somente será feito o merge de PRs revisados por múltiplas pessoas. Esse controle será feito através da verificação do número de reações ao PR que deverá ter ao menos dois.

Todo código deverá passar por Code Review através da feature "Pull Request (PR)" do GitHub durante o processo de merge da branch de "feature" para a branch alvo.
É recomendado que durante o desenvolvimento da feature seja criado um Pull Request de WIP (trabalho em progresso) para permitir coletar feedbacks ao longo do processo. Isso ocorre quando o título da MR é prefixado de WIP.

# Nomenclatura

## Padrão para nomes de arquivos 
Use sempre PascalCase para nomes de classes, interfaces e arquivos. 
O nome do arquivo deve ser o mesmo que o nome da classe separando o nome por hífen e o sufixo com pontos. (.sufixo.ts)
```typescript
// Exemplo:
// O arquivo dessa classe deve ter o nome: pascal-case.suffix.ts
class PascalCaseSuffix {} 
```
Os sufixos devem ser utilizados para indicar o tipo da classe. Exemplos de sufixos: repository, service, controller, entity, dto, impl, etc.    
```typescript
// Normalmente, o sufixo é utilizado para designar o tipo da classe.
class FooBarRepository {} // => foo-bar.repository.ts
class FooBarSerice {} // => foo-bar.service.ts
class FooBarController {} // => foo-bar.controller.ts
```

## Padrão para interfaces
```typescript
// Interfaces devem ser nomeadas com a primeira sendo o I (em maiúsculo) seguido do nome da classe. Interfaces não devem ter sufixos.
interface IFooBar {} // => foo-bar.ts
```

## Padrão para classes de implementação
```typescript
class FooBarRepositoryImpl {} // => foo-bar.repository.impl.ts
class FooBarSericeImpl {} // => foo-bar.service.impl.ts
class FooBarControllerImpl {} // => foo-bar.controller.impl.ts
```

## Padrão para classes de entidades
Deve-se utilizar o nome da entidade no singular e ter o sufixo entity.    
```typescript
class FooBarEntity {} // => foo-bar.entity.ts
```

## Padrão para classes de DTOs
Deve-se utilizar o nome da entidade no singular e ter o sufixo dto.
```typescript
// Prefera isso:
class FooBarDTO {} // => foo-bar.dto.ts
```

# Adicionar exportação com index.ts
é recomendado colocar um arquivo index.ts em cada pasta e exportar todos os arquivos da pasta para facilitar a leitura e importação de arquivos.

```typescript
// Evite isso:
- import { FooController } from './controllers/foo.controller';
- import { BarController } from './controllers/bar.controller';
// Faça isso:
+ import { FooController, BarController } from './controllers';
```

# Commits
Os commits devem seguir o padrão de mensagem abaixo, para facilitar a leitura e compreensão do histórico de commits.
    
    {{BRANCH-TYPE}}-{{TASK-NUMBER}}: {{COMMIT-TYPE}}:{{DESCRIPTION}}

BRANCH-TYPE: Tipo da branch que está sendo feito o commit. Ex: feature, bugfix, hotfix, etc.
TASK-NUMBER: Número da tarefa que está sendo feita. Ex: 1, 2, 3, etc.
COMMIT-TYPE: Tipo do commit. Ex: feat, fix, refactor, style, etc.
DESCRIPTION: Descrição do commit. Deve ser uma descrição curta e objetiva.

Exemplo:

    bugfix-1: refactor: refatorado-funcionalidade-X-para-atender-a-regra-de-negocio-Y