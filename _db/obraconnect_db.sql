-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 31/03/2026 às 02:25
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Banco de dados: `obraconnect_db`
--
CREATE DATABASE IF NOT EXISTS `obraconnect_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `obraconnect_db`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_avaliacao`
--

DROP TABLE IF EXISTS `oc__tb_avaliacao`;
CREATE TABLE IF NOT EXISTS `oc__tb_avaliacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_servico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nota_preco` tinyint(4) NOT NULL CHECK (`nota_preco` between 1 and 5),
  `nota_tempo_execucao` tinyint(4) NOT NULL CHECK (`nota_tempo_execucao` between 1 and 5),
  `nota_higiene` tinyint(4) NOT NULL CHECK (`nota_higiene` between 1 and 5),
  `nota_educacao` tinyint(4) NOT NULL CHECK (`nota_educacao` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_servico` (`id_servico`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_avaliacao`
--

INSERT INTO `oc__tb_avaliacao` (`id`, `id_servico`, `id_usuario`, `nota_preco`, `nota_tempo_execucao`, `nota_higiene`, `nota_educacao`, `comentario`, `data_avaliacao`) VALUES
(1, 1, 1, 5, 4, 5, 5, 'Excelente profissional, muito educado!', '2026-01-22 19:08:35'),
(2, 2, 1, 5, 4, 3, 4, 'Teste de avaliação', '2026-01-25 14:18:21'),
(4, 7, 1, 4, 5, 5, 5, 'fafafafafafa', '2026-03-31 00:10:49');

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_categoria`
--

DROP TABLE IF EXISTS `oc__tb_categoria`;
CREATE TABLE IF NOT EXISTS `oc__tb_categoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome_categoria` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_categoria` (`nome_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_categoria`
--

INSERT INTO `oc__tb_categoria` (`id`, `nome_categoria`) VALUES
(2, 'Armador(a) de Ferragens'),
(1, 'Arquiteto(a)'),
(3, 'Azulejista / Pisagista'),
(4, 'Bombeiro(a) Hidráulico / Encanador(a)'),
(5, 'Calheiro(a)'),
(6, 'Carpinteiro(a)'),
(7, 'Desentupidor(a)'),
(8, 'Designer de Interiores'),
(9, 'Eletricista'),
(10, 'Engenheiro(a) Civil'),
(11, 'Gesseiro(a)'),
(12, 'Impermeabilizador(a)'),
(13, 'Instalador(a) de Ar Condicionado'),
(14, 'Instalador(a) de Drywall'),
(15, 'Instalador(a) de Gás'),
(16, 'Instalador(a) de Sistemas de Segurança'),
(17, 'Jardineiro(a) / Paisagista'),
(18, 'Limpador(a) Pós-Obra'),
(19, 'Marceneiro(a)'),
(20, 'Marido de Aluguel'),
(21, 'Mestre de Obras'),
(22, 'Montador(a) de Andaimes'),
(23, 'Montador(a) de Móveis'),
(25, 'Pedreiro(a)'),
(26, 'Pintor(a)'),
(27, 'Serralheiro(a)'),
(28, 'Técnico(a) em Edificações'),
(24, 'Terraplanagem'),
(29, 'Topógrafo(a)'),
(30, 'Vidraceiro(a)');

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_servico`
--

DROP TABLE IF EXISTS `oc__tb_servico`;
CREATE TABLE IF NOT EXISTS `oc__tb_servico` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `desc_servico` text NOT NULL,
  `imagem_url` varchar(500) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_categoria` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_servico`
--

INSERT INTO `oc__tb_servico` (`id`, `id_usuario`, `titulo`, `desc_servico`, `imagem_url`, `id_categoria`, `ativo`, `data_cadastro`) VALUES
(1, 1, 'Reforma Total - Promoção', 'Agora com pintura inclusa e acabamento de qualidade', 'http://localhost:3001/uploads/placeholder-1.jpg', 10, 0, '2026-01-20 20:23:51'),
(2, 1, 'Serviço com Pintura', 'Pintura de qualidade superior com acabamento profissional', 'http://localhost:3001/uploads/placeholder-2.jpg', 26, 0, '2026-01-20 22:36:13'),
(3, 1, 'Consultoria de Projeto', 'Consultoria em projetos arquitetônicos e técnicos', 'http://localhost:3001/uploads/placeholder-3.jpg', 1, 1, '2026-01-25 14:33:27'),
(6, 1, 'TESTE2', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum', 'http://localhost:3001/uploads/imagem-1773795221254-89120496.png', 3, 0, '2026-03-18 00:53:41'),
(7, 2, 'Jose Construções', 'Serviço de construção em geral', 'http://localhost:3001/uploads/imagem-1774912852963-395474574.png', 25, 1, '2026-03-30 23:20:52');

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_usuario`
--

DROP TABLE IF EXISTS `oc__tb_usuario`;
CREATE TABLE IF NOT EXISTS `oc__tb_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `tipo_usuario` varchar(50) NOT NULL DEFAULT 'usuario',
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_usuario`
--

INSERT INTO `oc__tb_usuario` (`id`, `login`, `senha`, `nome_usuario`, `email`, `telefone`, `tipo_usuario`, `data_cadastro`) VALUES
(1, 'admin', '$2b$10$tN8el4BhPZfAYtQSg/8XsOpOXSsmWT77fW2I0MK2BmX7yQ2VRW2Xe', 'Administrador', 'vilander.costa@gmail.com', '19990000000', 'admin', '2026-01-20 18:13:57'),
(2, 'jose', '$2a$12$GKLsLUU4FTFNIQ.uU3750OkSf1cEcnvC8rZTKY/lNLGw9I4NTFd7K', 'José Silva', 'jose@email.com', '11999999999', 'prestador', '2026-01-22 19:39:12'),
(3, 'aline', '$2a$12$GKLsLUU4FTFNIQ.uU3750OkSf1cEcnvC8rZTKY/lNLGw9I4NTFd7K', 'Aline Costa', 'aline@teste.com', '11988888888', 'usuario', '2026-01-25 14:28:43'),
(4, 'jose-antonio', '$2a$12$GKLsLUU4FTFNIQ.uU3750OkSf1cEcnvC8rZTKY/lNLGw9I4NTFd7K', 'José Antonio', 'jose.antonio@teste.com', '11987654321', 'prestador', '2026-01-25 15:35:18');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `oc__vw_avaliacoes_do_servico`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `oc__vw_avaliacoes_do_servico`;
CREATE TABLE IF NOT EXISTS `oc__vw_avaliacoes_do_servico` (
`id` int(11)
,`id_servico` int(11)
,`id_usuario` int(11)
,`nota_preco` tinyint(4)
,`nota_tempo_execucao` tinyint(4)
,`nota_higiene` tinyint(4)
,`nota_educacao` tinyint(4)
,`comentario` text
,`data_avaliacao` timestamp
,`nome_usuario` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `oc__vw_detalhes_servico`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `oc__vw_detalhes_servico`;
CREATE TABLE IF NOT EXISTS `oc__vw_detalhes_servico` (
`id` int(11)
,`id_usuario` int(11)
,`titulo` varchar(100)
,`desc_servico` text
,`imagem_url` varchar(500)
,`id_categoria` int(11)
,`ativo` tinyint(1)
,`data_cadastro` timestamp
,`nome_usuario` varchar(100)
,`email` varchar(100)
,`telefone` varchar(20)
,`nota_media` decimal(10,2)
,`total_avaliacoes` bigint(21)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `oc__vw_historico_de_avaliacoes`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `oc__vw_historico_de_avaliacoes`;
CREATE TABLE IF NOT EXISTS `oc__vw_historico_de_avaliacoes` (
`id` int(11)
,`id_servico` int(11)
,`id_usuario` int(11)
,`nota_preco` tinyint(4)
,`nota_tempo_execucao` tinyint(4)
,`nota_higiene` tinyint(4)
,`nota_educacao` tinyint(4)
,`comentario` text
,`data_avaliacao` timestamp
,`nome_servico` varchar(100)
,`nome_usuario` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `oc__vw_servicos_ativos`
-- (Veja abaixo para a visão atual)
--
DROP VIEW IF EXISTS `oc__vw_servicos_ativos`;
CREATE TABLE IF NOT EXISTS `oc__vw_servicos_ativos` (
`id` int(11)
,`id_usuario` int(11)
,`titulo` varchar(100)
,`desc_servico` text
,`imagem_url` varchar(500)
,`id_categoria` int(11)
,`ativo` tinyint(1)
,`data_cadastro` timestamp
,`nome_usuario` varchar(100)
,`email` varchar(100)
,`nota_media` decimal(10,2)
,`total_avaliacoes` bigint(21)
);

-- --------------------------------------------------------

--
-- Estrutura para view `oc__vw_avaliacoes_do_servico`
--
DROP TABLE IF EXISTS `oc__vw_avaliacoes_do_servico`;

DROP VIEW IF EXISTS `oc__vw_avaliacoes_do_servico`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `oc__vw_avaliacoes_do_servico`  AS SELECT `oc__tb_avaliacao`.`id` AS `id`, `oc__tb_avaliacao`.`id_servico` AS `id_servico`, `oc__tb_avaliacao`.`id_usuario` AS `id_usuario`, `oc__tb_avaliacao`.`nota_preco` AS `nota_preco`, `oc__tb_avaliacao`.`nota_tempo_execucao` AS `nota_tempo_execucao`, `oc__tb_avaliacao`.`nota_higiene` AS `nota_higiene`, `oc__tb_avaliacao`.`nota_educacao` AS `nota_educacao`, `oc__tb_avaliacao`.`comentario` AS `comentario`, `oc__tb_avaliacao`.`data_avaliacao` AS `data_avaliacao`, `oc__tb_usuario`.`nome_usuario` AS `nome_usuario` FROM (`oc__tb_avaliacao` join `oc__tb_usuario` on(`oc__tb_avaliacao`.`id_usuario` = `oc__tb_usuario`.`id`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `oc__vw_detalhes_servico`
--
DROP TABLE IF EXISTS `oc__vw_detalhes_servico`;

DROP VIEW IF EXISTS `oc__vw_detalhes_servico`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `oc__vw_detalhes_servico`  AS SELECT `oc__tb_servico`.`id` AS `id`, `oc__tb_servico`.`id_usuario` AS `id_usuario`, `oc__tb_servico`.`titulo` AS `titulo`, `oc__tb_servico`.`desc_servico` AS `desc_servico`, `oc__tb_servico`.`imagem_url` AS `imagem_url`, `oc__tb_servico`.`id_categoria` AS `id_categoria`, `oc__tb_servico`.`ativo` AS `ativo`, `oc__tb_servico`.`data_cadastro` AS `data_cadastro`, `oc__tb_usuario`.`nome_usuario` AS `nome_usuario`, `oc__tb_usuario`.`email` AS `email`, `oc__tb_usuario`.`telefone` AS `telefone`, cast(coalesce(avg((`oc__tb_avaliacao`.`nota_preco` + `oc__tb_avaliacao`.`nota_tempo_execucao` + `oc__tb_avaliacao`.`nota_higiene` + `oc__tb_avaliacao`.`nota_educacao`) / 4),0) as decimal(10,2)) AS `nota_media`, count(`oc__tb_avaliacao`.`id`) AS `total_avaliacoes` FROM ((`oc__tb_servico` join `oc__tb_usuario` on(`oc__tb_servico`.`id_usuario` = `oc__tb_usuario`.`id`)) left join `oc__tb_avaliacao` on(`oc__tb_servico`.`id` = `oc__tb_avaliacao`.`id_servico`)) GROUP BY `oc__tb_servico`.`id` ;

-- --------------------------------------------------------

--
-- Estrutura para view `oc__vw_historico_de_avaliacoes`
--
DROP TABLE IF EXISTS `oc__vw_historico_de_avaliacoes`;

DROP VIEW IF EXISTS `oc__vw_historico_de_avaliacoes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `oc__vw_historico_de_avaliacoes`  AS SELECT `oc__tb_avaliacao`.`id` AS `id`, `oc__tb_avaliacao`.`id_servico` AS `id_servico`, `oc__tb_avaliacao`.`id_usuario` AS `id_usuario`, `oc__tb_avaliacao`.`nota_preco` AS `nota_preco`, `oc__tb_avaliacao`.`nota_tempo_execucao` AS `nota_tempo_execucao`, `oc__tb_avaliacao`.`nota_higiene` AS `nota_higiene`, `oc__tb_avaliacao`.`nota_educacao` AS `nota_educacao`, `oc__tb_avaliacao`.`comentario` AS `comentario`, `oc__tb_avaliacao`.`data_avaliacao` AS `data_avaliacao`, `oc__tb_servico`.`titulo` AS `nome_servico`, `oc__tb_usuario`.`nome_usuario` AS `nome_usuario` FROM ((`oc__tb_avaliacao` join `oc__tb_servico` on(`oc__tb_avaliacao`.`id_servico` = `oc__tb_servico`.`id`)) join `oc__tb_usuario` on(`oc__tb_servico`.`id_usuario` = `oc__tb_usuario`.`id`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `oc__vw_servicos_ativos`
--
DROP TABLE IF EXISTS `oc__vw_servicos_ativos`;

DROP VIEW IF EXISTS `oc__vw_servicos_ativos`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `oc__vw_servicos_ativos`  AS SELECT `oc__tb_servico`.`id` AS `id`, `oc__tb_servico`.`id_usuario` AS `id_usuario`, `oc__tb_servico`.`titulo` AS `titulo`, `oc__tb_servico`.`desc_servico` AS `desc_servico`, `oc__tb_servico`.`imagem_url` AS `imagem_url`, `oc__tb_servico`.`id_categoria` AS `id_categoria`, `oc__tb_servico`.`ativo` AS `ativo`, `oc__tb_servico`.`data_cadastro` AS `data_cadastro`, `oc__tb_usuario`.`nome_usuario` AS `nome_usuario`, `oc__tb_usuario`.`email` AS `email`, cast(coalesce(avg((`oc__tb_avaliacao`.`nota_preco` + `oc__tb_avaliacao`.`nota_tempo_execucao` + `oc__tb_avaliacao`.`nota_higiene` + `oc__tb_avaliacao`.`nota_educacao`) / 4),0) as decimal(10,2)) AS `nota_media`, count(`oc__tb_avaliacao`.`id`) AS `total_avaliacoes` FROM ((`oc__tb_servico` join `oc__tb_usuario` on(`oc__tb_servico`.`id_usuario` = `oc__tb_usuario`.`id`)) left join `oc__tb_avaliacao` on(`oc__tb_servico`.`id` = `oc__tb_avaliacao`.`id_servico`)) WHERE `oc__tb_servico`.`ativo` = 1 GROUP BY `oc__tb_servico`.`id` ORDER BY `oc__tb_servico`.`data_cadastro` DESC ;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `oc__tb_avaliacao`
--
ALTER TABLE `oc__tb_avaliacao`
  ADD CONSTRAINT `oc__tb_avaliacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `oc__tb_usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `oc__tb_avaliacao_ibfk_2` FOREIGN KEY (`id_servico`) REFERENCES `oc__tb_servico` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `oc__tb_servico`
--
ALTER TABLE `oc__tb_servico`
  ADD CONSTRAINT `oc__tb_servico_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `oc__tb_usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `oc__tb_servico_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `oc__tb_categoria` (`id`) ON DELETE SET NULL;
COMMIT;
