-- Schema: sistema de checklist de equipamentos
-- Baseado em requisitos checklist equip.md + CRUD.md

CREATE DATABASE IF NOT EXISTS checklist
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE checklist;

-- Único perfil com login tradicional (RF09). Não tem CRUD via app, é seed/manual.
CREATE TABLE administradores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_administradores_email (email)
) ENGINE=InnoDB;

CREATE TABLE clientes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  image VARCHAR(255) NULL,
  status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_clientes_status (status)
) ENGINE=InnoDB;

-- Social Media. Sem senha: identificação por PIN de 4 dígitos (hash), sem sessão.
CREATE TABLE funcionarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  role VARCHAR(50) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_funcionarios_status (status)
) ENGINE=InnoDB;

CREATE TABLE itens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  image VARCHAR(255) NULL,
  status ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_itens_status (status)
) ENGINE=InnoDB;

-- status: aberta -> concluida (RF06, funcionário) ou aberta -> cancelada (RN03, soft delete só Admin)
CREATE TABLE comandas (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_funcionario INT UNSIGNED NOT NULL,
  id_cliente INT UNSIGNED NOT NULL,
  status ENUM('aberta', 'concluida', 'cancelada') NOT NULL DEFAULT 'aberta',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  concluded_at DATETIME NULL,
  CONSTRAINT fk_comandas_funcionario FOREIGN KEY (id_funcionario) REFERENCES funcionarios(id),
  CONSTRAINT fk_comandas_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id),
  INDEX idx_comandas_funcionario_status (id_funcionario, status)
) ENGINE=InnoDB;

-- Checklist de itens de uma comanda. Criada junto com a comanda, imutável depois (ver CRUD.md).
CREATE TABLE comanda_itens (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_comanda INT UNSIGNED NOT NULL,
  id_item INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comanda_itens_comanda FOREIGN KEY (id_comanda) REFERENCES comandas(id),
  CONSTRAINT fk_comanda_itens_item FOREIGN KEY (id_item) REFERENCES itens(id),
  UNIQUE KEY uq_comanda_item (id_comanda, id_item),
  INDEX idx_comanda_itens_item (id_item)
) ENGINE=InnoDB;
