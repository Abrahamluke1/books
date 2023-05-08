-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 21, 2023 at 06:17 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `audio books`
--

-- --------------------------------------------------------

--
-- Table structure for table `audio_books`
--

CREATE TABLE `audio_books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `audio_file_url` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audio_books`
--

INSERT INTO `audio_books` (`id`, `title`, `author`, `genre`, `language`, `description`, `cover_image_url`, `audio_file_url`, `price`, `created_at`, `updated_at`) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'English', 'A story about a man who tries to win back his lost love, but ends up in tragedy', 'https://example.com/great-gatsby-cover.jpg', 'https://example.com/great-gatsby-audio.mp3', '12.99', '2023-03-22 13:25:42', '2023-03-22 13:25:42'),
(2, 'The Catcher in the Rye', 'J.D. Salinger', 'Classic', 'English', 'A story about a teenager who struggles with alienation and growing up', 'https://example.com/catcher-in-the-rye-cover.jpg', 'https://example.com/catcher-in-the-rye-audio.mp3', '14.99', '2023-03-22 13:25:42', '2023-03-22 13:25:42'),
(3, 'Harry Potter and the Philosopher\'s Stone', 'J.K. Rowling', 'Fantasy', 'English', 'A story about a young wizard who attends a magical school', 'https://example.com/harry-potter-cover.jpg', 'https://example.com/harry-potter-audio.mp3', '19.99', '2023-03-22 13:25:42', '2023-03-22 13:25:42');

-- --------------------------------------------------------

--
-- Table structure for table `purchases` by users
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `audio_book_id` int(11) DEFAULT NULL,
  `purchased_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `user_id`, `audio_book_id`, `purchased_at`) VALUES
(1, 1, 1, '2022-01-01 11:00:00'),
(2, 2, 2, '2022-01-02 13:30:00'),
(3, 3, 1, '2022-01-03 15:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`by users
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `audio_book_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `created_at`, `updated_at`) VALUES
(1, 'john@example.com', 'password123', 'John', 'Doe', '2023-03-22 13:26:12', '2023-03-22 13:26:12'),
(2, 'jane@example.com', 'secret456', 'Jane', 'Doe', '2023-03-22 13:26:12', '2023-03-22 13:26:12'),
(3, 'bob@example.com', 'mypassword', 'Bob', 'Smith', '2023-03-22 13:26:12', '2023-03-22 13:26:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audio_books`
--
ALTER TABLE `audio_books`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `audio_book_id` (`audio_book_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`audio_book_id`) REFERENCES `audio_books` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
