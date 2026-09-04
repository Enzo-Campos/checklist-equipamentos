# Sistema de checklist de equipamentos

## Objetivo

#### Desenvolver um sistema para gerar pdf imprimível com um checklist dos equipamentos levados pelo digital para os clientes.

## Usuários do sistema

- Administrador — login com usuário e senha; gerencia funcionários, clientes, itens e exclusões
- Social mídia — sem login individual; seleciona o próprio nome em um dropdown + PIN de 4 dígitos no formulário da comanda (ver "Estratégia de autenticação")

## Problemas identificados

- Falta de controle dos itens levados para cliente.
- Impossibilidade de rastrear equipamentos no dia a dia.
- Falta de vínculo de responsável por equipamentos.


## Requisitos funcionais

- RF01 - Cadastrar comandas de itens (checklist com múltiplos itens por comanda).
- RF02 - Vincular comandas com Social Media.
- RF03 - Criação e exclusão de funcionários.
- RF04 - Criação e exclusão de cliente.
- RF05 - Criação de itens por qualquer usuário; atualização e exclusão apenas por Admin.
- RF06 - Check para finalizar comanda e liberar itens.
- RF07 - Histórico de comandas (aba exclusiva do Admin): quem criou, data de criação, cliente e data de conclusão. Demais usuários veem apenas as próprias comandas ativas.
- RF08 - Gerar pdf para impressão, com campo de assinatura para ser assinado fisicamente à mão (sem captura digital de assinatura).
- RF09 - Login apenas para administrador; demais usuários se identificam selecionando o nome no dropdown do formulário da comanda + PIN de 4 dígitos cadastrado pelo Admin.

## Requisitos não funcionais

- RNF01 - Versão mobile funcional.

## Regras de negócio

- RN01 - Um item não pode ser adicionado a duas comandas em aberto ao mesmo tempo (verificado via `Comanda_Itens` + status da comanda).
- RN02 - Apenas administradores podem criar e excluir cliente e funcionários, e acessar a aba de histórico (todas as comandas, qualquer status). Funcionários só veem as próprias comandas ativas.
- RN03 - Apenas administradores podem excluir (soft delete) itens e comandas; demais usuários podem apenas concluir comandas (alterar `status` para finalizada).

## Estratégia de autenticação

Funcionário (Social Media) não tem login/senha individual. Identificação por PIN numérico de 4 dígitos, cadastrado pelo Admin junto com o funcionário:

- Ao criar ou concluir uma comanda: seleciona o nome no dropdown + digita o PIN. Sem sessão/logout — não precisa "ficar logado".
- Leitura/consulta (histórico, listagens) livre por nome, sem exigir PIN.
- Admin mantém login completo (usuário/senha) com sessão persistente no dispositivo.

## Decisões técnicas

- Backend: Node/Express + MySQL.
- Autenticação: JWT com sessão persistente para Admin; PIN de 4 dígitos (sem sessão) para funcionário.
- Imagens (Cliente/Itens): armazenamento em disco local via `multer`.
- Geração de PDF: `pdfkit` — não precisa de Chromium/headless browser como o `puppeteer`, é mais leve e rápido para gerar um documento simples e tabular (dados da comanda, itens, linha de assinatura), o que ajuda no RNF01 (mobile/baixo consumo de recursos no servidor).

## Dúvidas

-
