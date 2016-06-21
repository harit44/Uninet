-- phpMyAdmin SQL Dump
-- version 4.4.13.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 31, 2016 at 09:10 PM
-- Server version: 5.6.27-0ubuntu1
-- PHP Version: 5.6.11-1ubuntu3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `UniNetExpressLane`
--

-- --------------------------------------------------------

--
-- Table structure for table `accessLogs`
--

CREATE TABLE IF NOT EXISTS `accessLogs` (
  `id` int(255) NOT NULL,
  `user` varchar(40) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `action` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `actionType`
--

CREATE TABLE IF NOT EXISTS `actionType` (
  `action` int(255) NOT NULL,
  `nameE` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `calledContrlRoutines`
--

CREATE TABLE IF NOT EXISTS `calledContrlRoutines` (
  `callCrtlid` int(255) NOT NULL,
  `crtlRoutineID` int(255) NOT NULL,
  `said` int(255) NOT NULL,
  `timestamp` int(255) NOT NULL,
  `returnVal` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `controllerRoutines`
--

CREATE TABLE IF NOT EXISTS `controllerRoutines` (
  `ctrlRoutineID` int(255) NOT NULL,
  `NameE` varchar(40) NOT NULL,
  `routineCode` varchar(40) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `emailLogs`
--

CREATE TABLE IF NOT EXISTS `emailLogs` (
  `eid` int(255) NOT NULL,
  `said` int(255) NOT NULL,
  `eTemplated` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `EmailTemplate`
--

CREATE TABLE IF NOT EXISTS `EmailTemplate` (
  `emlid` int(255) NOT NULL,
  `toE` varchar(40) NOT NULL,
  `contentE` varchar(40) NOT NULL,
  `endingE` varchar(40) NOT NULL,
  `dateE` varchar(40) NOT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `createdBy` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `flag`
--

CREATE TABLE IF NOT EXISTS `flag` (
  `flag` int(50) NOT NULL,
  `nameE` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `heartBeatMonitors`
--

CREATE TABLE IF NOT EXISTS `heartBeatMonitors` (
  `id` int(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `nodeid` int(255) NOT NULL,
  `conditionString` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `memberType`
--

CREATE TABLE IF NOT EXISTS `memberType` (
  `membertype` int(50) NOT NULL,
  `nameE` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `nodeinfo`
--

CREATE TABLE IF NOT EXISTS `nodeinfo` (
  `nodeid` int(11) NOT NULL,
  `IP` varchar(40) NOT NULL,
  `location` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `org`
--

CREATE TABLE IF NOT EXISTS `org` (
  `org` int(50) NOT NULL,
  `nameE` varchar(40) NOT NULL,
  `contractP` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `org`
--

INSERT INTO `org` (`org`, `nameE`, `contractP`, `email`) VALUES
(1, 'AIS', 'suchat', 'AISthailand@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `ResourceAllocated`
--

CREATE TABLE IF NOT EXISTS `ResourceAllocated` (
  `rAllocatedID` int(255) NOT NULL,
  `said` int(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `resourceString1` varchar(40) NOT NULL,
  `resourceString2` varchar(40) NOT NULL,
  `startTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `endTime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `role` int(50) NOT NULL,
  `nameE` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ServiceActivities`
--

CREATE TABLE IF NOT EXISTS `ServiceActivities` (
  `said` int(255) NOT NULL,
  `sid` int(255) NOT NULL,
  `actType` int(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `actbyuser` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ServiceActivityType`
--

CREATE TABLE IF NOT EXISTS `ServiceActivityType` (
  `actType` int(255) NOT NULL,
  `nameE` int(255) NOT NULL,
  `emailRag` int(255) NOT NULL,
  `emailid` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ServiceRequests`
--

CREATE TABLE IF NOT EXISTS `ServiceRequests` (
  `sid` int(255) NOT NULL,
  `user` int(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ServiceRequests`
--

INSERT INTO `ServiceRequests` (`sid`, `user`, `timestamp`) VALUES
(1, 0, '2016-03-12 07:30:34');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `id` int(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `NameE` varchar(40) NOT NULL,
  `LastNameE` varchar(40) NOT NULL,
  `org` int(50) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `email` varchar(40) NOT NULL,
  `membertype` int(50) NOT NULL,
  `role` int(50) DEFAULT NULL,
  `flag` int(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `username`, `password`, `NameE`, `LastNameE`, `org`, `phone`, `email`, `membertype`, `role`, `flag`) VALUES
(22, 'admin', '$2a$10$e1gqpzWvXoiKeuWdpSA1QO1sd8JzqeHHV3Q/O6Bux.c6kLs.lqISu', 'test', 'test', 7, '0945457045', 'spirit_of_new07@hotmail.com', 2, 1, 1),
(26, 'pacman1141', '$2a$10$0Nr4cPaj9rBgx0wc07l9auIggSRoxk6wzJC/NlFPtRKvePjb/mDpq', 'new', 'phasuk', 7, '1', '1', 1, 2, 1),
(28, 'pacman', '$2a$10$H8CjRnW7qcjSv7hR2my8We.QTjAsrOurknIKjLvcPuhY3OJXsTZme', 'chatdanai', 'phasuk', 6, '1', '1', 0, 0, 0),
(30, '123', '$2a$10$85iuUEbYWUZ/YNA1LzZ5mOPkBk0sxZ4qfDmdzF6Y.fe5pz.6OGx2m', '123', '123', 6, '123', '123', 1, 2, 0),
(31, '1', '$2a$10$3yQ764PyziGcp0ScAgV1I.OUzDfs/9s7W9ZeKvxgZcSa0p5QKnwTu', '1', '1', 1, '1', '1', 0, 2, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accessLogs`
--
ALTER TABLE `accessLogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `actionType`
--
ALTER TABLE `actionType`
  ADD PRIMARY KEY (`action`);

--
-- Indexes for table `calledContrlRoutines`
--
ALTER TABLE `calledContrlRoutines`
  ADD PRIMARY KEY (`callCrtlid`);

--
-- Indexes for table `controllerRoutines`
--
ALTER TABLE `controllerRoutines`
  ADD PRIMARY KEY (`ctrlRoutineID`);

--
-- Indexes for table `flag`
--
ALTER TABLE `flag`
  ADD PRIMARY KEY (`flag`);

--
-- Indexes for table `heartBeatMonitors`
--
ALTER TABLE `heartBeatMonitors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memberType`
--
ALTER TABLE `memberType`
  ADD PRIMARY KEY (`membertype`);

--
-- Indexes for table `org`
--
ALTER TABLE `org`
  ADD PRIMARY KEY (`org`);

--
-- Indexes for table `ResourceAllocated`
--
ALTER TABLE `ResourceAllocated`
  ADD PRIMARY KEY (`rAllocatedID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role`);

--
-- Indexes for table `ServiceActivities`
--
ALTER TABLE `ServiceActivities`
  ADD PRIMARY KEY (`said`);

--
-- Indexes for table `ServiceActivityType`
--
ALTER TABLE `ServiceActivityType`
  ADD PRIMARY KEY (`actType`);

--
-- Indexes for table `ServiceRequests`
--
ALTER TABLE `ServiceRequests`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=32;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
