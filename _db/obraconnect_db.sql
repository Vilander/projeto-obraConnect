-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 25/01/2026 às 17:59
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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
CREATE TABLE `oc__tb_avaliacao` (
  `id` int(11) NOT NULL,
  `id_servico` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nota_preco` tinyint(4) NOT NULL CHECK (`nota_preco` between 1 and 5),
  `nota_tempo_execucao` tinyint(4) NOT NULL CHECK (`nota_tempo_execucao` between 1 and 5),
  `nota_higiene` tinyint(4) NOT NULL CHECK (`nota_higiene` between 1 and 5),
  `nota_educacao` tinyint(4) NOT NULL CHECK (`nota_educacao` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `data_avaliacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_avaliacao`
--

INSERT INTO `oc__tb_avaliacao` (`id`, `id_servico`, `id_usuario`, `nota_preco`, `nota_tempo_execucao`, `nota_higiene`, `nota_educacao`, `comentario`, `data_avaliacao`) VALUES
(1, 1, 1, 5, 4, 5, 5, 'Excelente profissional, muito educado!', '2026-01-22 19:08:35'),
(2, 2, 1, 5, 4, 3, 4, 'Teste de avaliação', '2026-01-25 14:18:21'),
(3, 4, 3, 3, 4, 2, 4, 'Bom trabalho', '2026-01-25 15:37:01');

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_categoria`
--

DROP TABLE IF EXISTS `oc__tb_categoria`;
CREATE TABLE `oc__tb_categoria` (
  `id` int(11) NOT NULL,
  `nome_categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
CREATE TABLE `oc__tb_servico` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `desc_servico` text NOT NULL,
  `imagem_url` varchar(500) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_servico`
--

INSERT INTO `oc__tb_servico` (`id`, `id_usuario`, `titulo`, `desc_servico`, `imagem_url`, `id_categoria`, `ativo`, `data_cadastro`) VALUES
(1, 1, 'Reforma Total - Promoção', 'Agora com pintura inclusa e acabamento de qualidade', 'http://localhost:3001/uploads/placeholder-1.jpg', 10, 1, '2026-01-20 20:23:51'),
(2, 1, 'Serviço com Pintura', 'Pintura de qualidade superior com acabamento profissional', 'http://localhost:3001/uploads/placeholder-2.jpg', 26, 1, '2026-01-20 22:36:13'),
(3, 1, 'Consultoria de Projeto', 'Consultoria em projetos arquitetônicos e técnicos', 'http://localhost:3001/uploads/placeholder-3.jpg', 1, 1, '2026-01-25 14:33:27'),
(4, 4, 'Alvenaria e Enchimento', 'Pedreiro com experiência em alvenaria moderna', 'http://localhost:3001/uploads/placeholder-4.jpg', 25, 1, '2026-01-25 15:36:19');

-- --------------------------------------------------------

--
-- Estrutura para tabela `oc__tb_usuario`
--

DROP TABLE IF EXISTS `oc__tb_usuario`;
CREATE TABLE `oc__tb_usuario` (
  `id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `tipo_usuario` varchar(50) NOT NULL DEFAULT 'usuario',
  `data_cadastro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `oc__tb_usuario`
--

INSERT INTO `oc__tb_usuario` (`id`, `login`, `senha`, `nome_usuario`, `email`, `telefone`, `tipo_usuario`, `data_cadastro`) VALUES
(1, 'admin', '$2b$10$tN8el4BhPZfAYtQSg/8XsOpOXSsmWT77fW2I0MK2BmX7yQ2VRW2Xe', 'Administrador', 'vilander.costa@gmail.com', '19993223509', 'admin', '2026-01-20 18:13:57'),
(2, 'jose', '$2b$10$f3uw0JbWIxIY3yP95/xUI.wncxJ/vgC0P/Ln/JotUHyvuR0Swlhna', 'José Silva', 'jose@email.com', '11999999999', 'usuario', '2026-01-22 19:39:12'),
(3, 'aline', '$2b$10$dOIh00LEeBu5lT38sm9Rueeo5nToldA1ppU9YNUcyKh.bJWobiTci', 'Aline Costa', 'aline@teste.com', '11988888888', 'usuario', '2026-01-25 14:28:43'),
(4, 'jose-antonio', '$2b$10$GyByPscflcANbpeOVSJr7ejBoGntNiCp6joyZFNNyZS1lmBIXwTEK', 'José Antonio', 'jose.antonio@teste.com', '11987654321', 'prestador', '2026-01-25 15:35:18');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `oc__tb_avaliacao`
--
ALTER TABLE `oc__tb_avaliacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_servico` (`id_servico`);

--
-- Índices de tabela `oc__tb_categoria`
--
ALTER TABLE `oc__tb_categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome_categoria` (`nome_categoria`);

--
-- Índices de tabela `oc__tb_servico`
--
ALTER TABLE `oc__tb_servico`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `oc__tb_usuario`
--
ALTER TABLE `oc__tb_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `oc__tb_avaliacao`
--
ALTER TABLE `oc__tb_avaliacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `oc__tb_categoria`
--
ALTER TABLE `oc__tb_categoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de tabela `oc__tb_servico`
--
ALTER TABLE `oc__tb_servico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `oc__tb_usuario`
--
ALTER TABLE `oc__tb_usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
