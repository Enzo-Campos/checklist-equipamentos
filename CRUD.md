Entidades:

Administrador - `id`, `nome`, `email`, `senha`, `created_at`

Cliente - `id`, `nome`, `image`, `status`, `created_at`

Funcionário - `id`, `nome`, `role`, `pin`, `status`, `created_at`

Itens - `id`, `nome`, `image`, `status`, `created_at`

Comandas - `id`, `id_funcionario`, `id_cliente`, `status`, `created_at`, `concluded_at`

Comanda_Itens - `id`, `id_comanda`, `id_item`, `created_at`

> `Comanda_Itens` é a tabela associativa entre Comandas e Itens (uma comanda = checklist com vários itens). É criada junto com a Comanda e não é editável depois — para trocar os itens de uma comanda já criada, é preciso cancelar (soft delete, Admin) e criar uma nova.

## Administrador

Campos: `id`, `nome`, `email`, `senha`, `created_at`

Não é gerenciado via CRUD do app (login apenas). Registro criado direto no banco/seed inicial.

## Cliente

Campos: `id`, `nome`, `image`, `status`, `created_at`

| Operação | Quem pode | Regras |
| --- | --- | --- |
| Create | Admin | — |
| Read | Todos | — |
| Update | Admin | Apenas alterar imagem |
| Delete | Admin | Soft delete (`status = inativo`) |

## Funcionários

Campos: `id`, `nome`, `role`, `pin`, `status`, `created_at`

| Operação | Quem pode | Regras |
| --- | --- | --- |
| Create | Admin | Admin define o `pin` (4 dígitos) do funcionário |
| Read | Todos | `pin` nunca é exposto na leitura (usado só para validação de ação) |
| Update | Admin | — |
| Delete | Admin | Soft delete (`status = inativo`) |

## Itens

Campos: `id`, `nome`, `image`, `status`, `created_at`

| Operação | Quem pode | Regras |
| --- | --- | --- |
| Create | Todos | — |
| Read | Todos | — |
| Update | Admin | Funcionário pode apenas criar itens novos, não editar existentes |
| Delete | Admin | Soft delete (`status = inativo`) |

## Comandas

Campos: `id`, `id_funcionario`, `id_cliente`, `status`, `created_at`

| Operação | Quem pode | Regras |
| --- | --- | --- |
| Create | Todos | Requer nome do funcionário + `pin` válido. Cria junto os registros em `Comanda_Itens`; valida RN01 (item não pode estar em outra comanda aberta) |
| Read | Escopo por perfil | Admin: aba de histórico com todas as comandas (qualquer status), mostrando quem criou, data de criação, cliente e data de conclusão. Funcionário: vê apenas as próprias comandas (`id_funcionario`) com `status = aberta` |
| Update | Todos | Requer `pin` válido do funcionário. Apenas o campo `status`, usado para concluir a comanda e liberar os itens (RF06). Os itens vinculados não podem ser alterados após a criação |
| Delete | Admin | Soft delete (`status = inativo`). Demais usuários só podem concluir (via Update), não excluir |

## Comanda_Itens

Campos: `id`, `id_comanda`, `id_item`, `created_at`

| Operação | Quem pode | Regras |
| --- | --- | --- |
| Create | Todos | Feito junto com a criação da Comanda, não isoladamente |
| Read | Todos | — |
| Update | Ninguém | Lista de itens é imutável após a criação da comanda |
| Delete | Admin | Só ocorre via delete em cascata da Comanda |
