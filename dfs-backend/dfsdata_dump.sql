-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 01, 2023 at 04:42 PM
-- Server version: 8.0.35-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dfstest`
--

-- --------------------------------------------------------

--
-- Table structure for table `Comments`
--

CREATE TABLE `Comments` (
  `discussion_id` varchar(255) DEFAULT NULL,
  `comment_id` varchar(255) NOT NULL,
  `comment` text,
  `format` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `dataset_version_id` varchar(255) DEFAULT NULL,
  `comment_date` bigint DEFAULT NULL,
  `edit_date` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ContactUs`
--

CREATE TABLE `ContactUs` (
  `NAME` varchar(255) DEFAULT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `MESSAGE` varchar(255) DEFAULT NULL,
  `CreationDate` datetime NOT NULL DEFAULT (now())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ContactUs`
--

INSERT INTO `ContactUs` (`NAME`, `EMAIL`, `MESSAGE`, `CreationDate`) VALUES
('Soham', 'soham.karanjkar122020@gcoeara.ac.in', 'I am unable to Login as server is Down', '2023-08-09 12:27:51'),
('Mr. D Udaya Bhaskar', 'udayabhaskar.d@sriinfotech.co.in', 'I am unable to register. Kindly Help ', '2023-08-04 04:45:32');

-- --------------------------------------------------------

--
-- Table structure for table `DataRequests`
--

CREATE TABLE `DataRequests` (
  `request_id` varchar(255) NOT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `dataset_version_id` varchar(255) DEFAULT NULL,
  `requester_id` varchar(255) DEFAULT NULL,
  `approved_status` varchar(255) DEFAULT 'null',
  `latest_status_change_date` datetime DEFAULT NULL,
  `request_creation_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Dataset`
--

CREATE TABLE `Dataset` (
  `dataset_id` varchar(255) NOT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `reference_list` mediumtext,
  `dataset_name` varchar(255) DEFAULT NULL,
  `dataset_description` text,
  `public` tinyint(1) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `dataset_data` longblob,
  `dataset_format` varchar(255) DEFAULT NULL,
  `temporary` tinyint(1) DEFAULT NULL,
  `dataset_status` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Dataset`
--

INSERT INTO `Dataset` (`dataset_id`, `author_id`, `reference_list`, `dataset_name`, `dataset_description`, `public`, `source`, `dataset_data`, `dataset_format`, `temporary`, `dataset_status`, `domain`) VALUES
('08a9e0ed-60a4-4f0d-b8cd-214f68f2f272', 'jai.bhatnagar@research.iiit.ac.in', '...', 'name', 'Π', 1, 'yes', NULL, 'csv', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('1ee4e88f-805c-49c4-a515-85e8827b32d1', 'vamshi.golla@ihub-data.iiit.ac.in', 'none', 'test', 'noΠ', 1, 'no', NULL, 'jpg', 0, 'APPROVED', 'Healthcare Datasets'),
('2b3c9679-04c9-4897-a4fb-ea73fe3b5778', 'akshitsinha2801@gmail.com', 'fgd', '0', 'gdf', 1, 'dfg', NULL, 'dfg', 0, 'APPROVED', 'City scale Road Audit'),
('2cb48c51-50c3-417c-8bad-aaa6b083bbee', 'sgprasad@carefoundation.org.in', '.', 'CVD Dataset', 'Objectives\nTo conduct a population screening (10K) in the age group of 25-55 for assessing the risk of CVD in different economic sections of Society including the urban poor. \nCalculate the risk score using a questionnaire that contains demographic data, occupational history, medical history, lifestyle, stress, diet and data gathered from IoT devices to categorize the individuals into Low Risk (LR), Medium Risk (MR), and High Risk (HR).\nBlood tests (Lipid profile, HbA1c, Apolipoprotein B) will be done for the assessment of CVD risk in selected participants based on their scoring system.\nRetinal scan is performed to understand if this can be an effective way of predicting onset of cardiovascular disease. \nIn addition selected participants based on risk categorization, will undergo  Ca-CT for understanding /validating the risk score from the survey. \nA genetic evaluation will also conducted  for identifying possible biomarkers that  can assist in predicting the possibility of early onset of CVD.\n\nOutcomes\n1. To establish a trend of the risk for CVD disease in the specific age group of 25-55 based on collected information from the survey.\n2. To establish one or two biomarkers that give us a fair indicator as a predictor for CVD and make use of this test at the screening & diagnosis level itself.\n3. To thereby identify patients based on the results of the biomarker test from the survey  susceptible to CVD and initiate appropriate action for stopping the progression of CVD based on the Ca-CT score and genomic data analysis.\n4. To create an epidemiological database consisting a multimodal dataset of clinical parametric data, images and molecular/genomic information along with possible clinical information.\n5. AI Prediction- be able to identify causal agents and forecast disease onset using the OMICS and associated data.\n6. To build AI-based solutions which can be assist in the screening for identification of CVD based on specific patterns and characteristics that emerge from the multimodal dataset obtained from the survey.', 1, 'NA', NULL, 'XLSX, DCM, PDF, JPEG, PNG', 0, 'APPROVED', 'Healthcare Datasets'),
('353f4f96-97f9-4e5c-afbe-6c04b0bdc82f', 'pranjal.mahajan@research.iiit.ac.in', 'Pranjal Mahajan', 'Pranjal Mahajan', 'We have created a dataset for the project \"Development of an Energy Efficient mmWave Radar System Prototype for​ All-Weather Road-Safety and Traffic Applications\". This dataset consists of point cloud images generated using IWR1843BOOST FMCW radar, ROS and some python scripts. There are three different classes of point cloud images: 1) Pedestrians 2) 2-Wheelers 3) 4-Wheelers. In total there are approximately 15000 point cloud images.Π', 1, 'This dataset has been created by me.', NULL, 'The images are in png format.', 0, 'APPROVED', 'City scale Road Audit'),
('3decc13f-87be-48f0-9bc3-523b835b7f1f', 'akshitsinha2801@gmail.com', '23', '0', '23', 1, '23', NULL, '2', 0, 'APPROVED', 'Indian Driving Dataset (IDD)'),
('425be256-6fb9-4c08-82f4-5a5719c282d2', 'akshitsinha2801@gmail.com', 'g', '0', 'u', 1, 'u', NULL, 'i', 0, 'APPROVED', 'Indian Driving Dataset (IDD)'),
('42c0ca02-b47e-4298-ab79-c7ace3702de4', 'vamshi.golla@ihub-data.iiit.ac.in', 'None', 'Oralcancer_Images', 'The Oral Cancer Diagnostic Imaging Dataset is a highly specialized collection designed for the training, validation, and testing of Artificial Intelligence (AI) models aimed at identifying oral cancer. It comprises high-resolution medical images meticulously gathered from oral cancer patients, showcasing a variety of suspicious and non-suspicious oral conditions', 1, 'None', NULL, 'PNG', 0, 'APPROVED', 'Healthcare Datasets'),
('45017265-3722-42f5-84ad-49a2904bffc1', 'akshit.sinha@students.iiit.ac.in', 'This', 'Data', 'This', 1, 'This', NULL, 'CSV', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('453982e4-3ff8-4785-8d49-f887c8f4b48a', 'ml4science@iiit.ac.in', 'https://hai.iiit.ac.in/datasets.html', 'PLAS-5K', 'Accurate prediction of binding affinities between a small molecule and target proteins still remains to be a major challenge. The use of Artificial Intelligence (AI) models have been proposed as an alternative to traditional physics based scoring functions. Despite many advances in machine learning (ML) models over affinity prediction, they have mainly relied on feature engineering from static 3-Dimensional that often mask the dynamic features of protein-ligand interactions. To this end, we have curated MD-based datasets that provides protein-ligand affinities along with non-covalent interaction components for machine learning applications. Models built over these datasets can help to capture the dynamic binding modes by considering various geometric charactresitcs of the interaction. PLAS-5k comprises of 5000 protein-ligand complexes chosen from PDB database. The dataset consists of binding affinities along with energy components like electrostatic, van der Waals, polar and non-polar solvation energy calculated from molecular dynamics simulations using MMPBSA (Molecular Mechanics Poisson-Boltzmann Surface Area) method. The initial structures of all the 5000 protein ligand complexes are available in PDB format and the csv file containing information about binding affinity. This work is published in Scientific Data (https://doi.org/10.1038/s41597-022-01631-9)', 1, 'https://hai.iiit.ac.in/datasets.html', NULL, 'CSV/PDB', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('455a1940-d57b-4157-946a-ede8977cf0d9', 'pragya.singh@iiit.ac.in', 'NA', 'CVD - Population Scale Study', 'Multimodal dataset for classification of the CVD and associated risk factors in population level. (Includes lifestyle, habit history, clinical parameters and laboratory parameters. Along with few radiological images)Π', 1, 'NA', NULL, 'ZIP', 0, 'APPROVED', 'Healthcare Datasets'),
('48a57644-87ba-487d-ab2d-22c6b0ee1817', 'akshitsinha2801@gmail.com', 'o', '0', 'k', 1, 'o', NULL, 'h', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('4b883fdf-21d6-4f36-853d-d77b140ee96f', 'vamshi.golla@ihub-data.iiit.ac.in', 'None', 'Oral_Images', 'The Oral Cancer Diagnostic Imaging Dataset is a highly specialized collection designed for the training, validation, and testing of Artificial Intelligence (AI) models aimed at identifying oral cancer. It comprises high-resolution medical images meticulously gathered from oral cancer patients, showcasing a variety of suspicious and non-suspicious oral conditions.', 1, 'None', NULL, 'PNG/JPG/ZIP', 0, 'APPROVED', 'Healthcare Datasets'),
('547d94d3-0a34-4c3c-9f2e-a5cfa8ecad4d', 'akash.ranjan@ihub-data.iiit.ac.in', 'https://healthcare.iiit.ac.in/d4/plas5k/plas5k.html', 'PLAS-5K Variation 2', 'Description: Accurate prediction of binding affinities between a small molecule and target proteins still remains to be a major challenge. The use of Artificial Intelligence (AI) models have been proposed as an alternative to traditional physics based scoring functions. Despite many advances in machine learning (ML) models over affinity prediction, they have mainly relied on feature engineering from static 3-Dimensional that often mask the dynamic features of protein-ligand interactions. To this end, we have curated MD-based datasets that provides protein-ligand affinities along with non-covalent interaction components for machine learning applications. Models built over these datasets can help to capture the dynamic binding modes by considering various geometric charactresitcs of the interaction. PLAS-5k comprises of 5000 protein-ligand complexes chosen from PDB database. The dataset consists of binding affinities along with energy components like electrostatic, van der Waals, polar and non-polar solvation energy calculated from molecular dynamics simulations using MMPBSA (Molecular Mechanics Poisson-Boltzmann Surface Area) method. The initial structures of all the 5000 protein ligand complexes are available in PDB format and the csv file containing information about binding affinity. This work is published in Scientific Data (https://doi.org/10.1038/s41597-022-01631-9)', 1, 'https://healthcare.iiit.ac.in/d4/plas5k/plas5k.html', NULL, 'ZIP format', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('5a0b3c5a-594e-4f0a-b416-879716e70699', 'sarith.madhu@ihub-data.iiit.ac.in', 'https://idd.insaan.iiit.ac.in/dataset/details/', 'IDD Segmentation- Part 2', '20,000 images and fine semantic segmentation annotation (14K Train, 2K Val, 4K Test) from 350 drive sequences, in 2 part downloads - this data and the data released in 2018 as \"IDD - Segmentation (IDD 20k Part I)\"', 1, 'https://idd.insaan.iiit.ac.in/dataset/details/', NULL, 'TAR', 0, 'APPROVED', 'Indian Driving Dataset (IDD)'),
('5b6ca16b-e3c1-4497-9c6d-e27c5b8c756a', 'manasa.k@research.iiit.ac.in', '-', '0', 'A dataset with a broad array of information on patients (duly de-identified) admitted to Gandhi Medical Hospital in Hyderabad. Data is presented on a daily basis (with timestamps) with variables including patient history, laboratory test data, medication and ICU administration among others. See the metadata structure for further details. A set of CT images mapped to patient ID is also to be added in the near future. Focus Area : Public Health', 1, '-', NULL, '-', 0, 'APPROVED', 'Healthcare Datasets'),
('5fa5acd5-6251-4570-a758-9173e6fa4f4b', 'raghunath.iiit@gmail.com', 'https://inai.iiit.ac.in/domains/smart-mobility.html#project-2', 'INAI Challenge Dataset', 'Drivers of ADAS-fitted buses receive real-time safety alerts. AI-powered Advanced Driver Assistance Systems (ADAS) continuously monitors the road ahead and warns the driver a few seconds before a potential collision.\nADAS Safety alerts and warnings to driver are given below:\n1. Forward Collision Warning (FCW)\n2. Pedestrian Collision Warning (PCW)\n3. Headway Monitoring and Warning (HMW)\n4. Lane Departure Warning (LDW)\n\nADAS alerts provide real-time warnings and quick feedback to drivers. Such real-time warnings improve driver reaction time by up to 2X. Thus, irrespective of driving experience of the driver, driver alertness to road events improves and likelihood of dangerous road incidents reduces.\n\nAlso, following driver monitoring alerts are included:\n1. No seat belt\n2. Smoking\n3. On phone\n4. Hard brake\n5. Drowsy\n6. Asleep\n7. DistractedΠ', 1, 'https://inai.iiit.ac.in/domains/smart-mobility.html#project-2', NULL, 'CSV', 0, 'APPROVED', 'Indian Driving Dataset (IDD)'),
('60e62338-f7c6-4ff7-bc88-b09ef84118e6', 'manasa.k@research.iiit.ac.in', '-', '0', 'A dataset with a broad array of information on patients (duly de-identified) admitted to Gandhi Medical Hospital in Hyderabad. Data is presented on a daily basis (with timestamps) with variables including patient history, laboratory test data, medication and ICU administration among others. See the metadata structure for further details. A set of CT images mapped to patient ID is also to be added in the near future. Focus Area : Public Health', 1, '-', NULL, '-', 0, 'APPROVED', 'Healthcare Datasets'),
('68a6aa22-6f1b-4216-8e7b-5653c9be6512', 'manasa.k@research.iiit.ac.in', 'https://zenodo.org/record/5656776', 'Indian Brain Segmentation Dataset', 'Segmentation of sub-cortical structures from MRI scans is of interest in many neurological diagnoses. Indian Brain Segmentation Dataset (IBSD) consists of high-quality 1.5T T1w MRI data of 114 subjects generated under fixed imaging protocol along with corresponding manual annotation data of 14 sub-cortical structures done by expert radiologists. The number of MR scans in the dataset consists of an approximately equal number of male and female subjects belonging to a young age group (20-30 years). This data has been used to create a template for the young Indian population. This dataset can also be utilized for variety of tasks such as segmenting structures of interest, aligning/ registering images, etc, using traditional methods as well as Deep Learning approaches since it has adequate quantity of high quality data. Focus Area : Neuro and Mental Health', 1, 'https://zenodo.org/record/5656776', NULL, 'NII', 0, 'APPROVED', 'Healthcare Datasets'),
('68d0aa99-e875-4116-ab6b-7afe7f0b0b06', 'harsv689@gmail.com', 'drugs_discovery', '0', 'This dataset contains the drugs_info', 1, 'drugs', NULL, 'CSV', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('6e43c5b2-6925-4366-80d7-9f077295cc56', 'ml4science@iiit.ac.in', 'https://iiitaphyd-my.sharepoint.com/:f:/g/personal/rishal_aggarwal_research_iiit_ac_in/EhcNboS7dVZGh-et1qg1yg0BKrdMzJzN9z8T5gAcTUQJqw?e=Lj3oJq', 'APO-Bind', 'A dataset ligand unbound protein conformations for Machine Learning Applications in De Novo Drug Design. Ligand-free protein structure equivalents for 10,599 out of 16,608 protein-ligand complexes were obtained in the PDBbind v.2019 database with the purpose of enabling computation and large-scale validation of structure-based drug design methods on apo structures. This was done by mining the PDB database for apo protein structures with high sequence and structural alignment with proteins present in PDBbind', 1, 'https://iiitaphyd-my.sharepoint.com/:f:/g/personal/rishal_aggarwal_research_iiit_ac_in/EhcNboS7dVZGh-et1qg1yg0BKrdMzJzN9z8T5gAcTUQJqw?e=Lj3oJq', NULL, 'CSV/TAR', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('6ec68a16-e66b-44b6-b57e-6e64dd193b92', 'vamshi.golla@ihub-data.iiit.ac.in', 'None', 'Bicon_Checked', 'The Oral Cancer Diagnostic Imaging Dataset is a highly specialized collection designed for the training, validation, and testing of Artificial Intelligence (AI) models aimed at identifying oral cancer. It comprises high-resolution medical images meticulously gathered from oral cancer patients, showcasing a variety of suspicious and non-suspicious oral conditions. This images are taken from Biocon.', 1, 'Bicon', NULL, 'JPG', 0, 'APPROVED', 'Healthcare Datasets'),
('6f2364c0-c949-429c-b383-e741802533af', 'sarith.madhu@ihub-data.iiit.ac.in', 'https://idd.insaan.iiit.ac.in/dataset/details/', 'IDD Temporal Test', 'The IDD temporal dataset consists of the temporally nearby frames (+- 15 frames) from the IDD Segmentation and Detection Datasets. The 30 nearby frames for many of the frames in the IDD Segmentation dataset, is provided in the correspondingly named subfolders in the IDD temporal dataset.', 1, 'https://idd.insaan.iiit.ac.in/dataset/details/', NULL, 'TAR', 0, 'APPROVED', 'Indian Driving Dataset (IDD)'),
('712d3a07-8164-4a87-bc58-7c0d7fbdfb6d', 'akash.ranjan@ihub-data.iiit.ac.in', 'https://hai.iiit.ac.in/datasets.html', 'PLAS-5K Variation 3', 'Accurate prediction of binding affinities between a small molecule and target proteins still remains to be a major challenge. The use of Artificial Intelligence (AI) models have been proposed as an alternative to traditional physics based scoring functions. Despite many advances in machine learning (ML) models over affinity prediction, they have mainly relied on feature engineering from static 3-Dimensional that often mask the dynamic features of protein-ligand interactions. To this end, we have curated MD-based datasets that provides protein-ligand affinities along with non-covalent interaction components for machine learning applications. Models built over these datasets can help to capture the dynamic binding modes by considering various geometric charactresitcs of the interaction. PLAS-5k comprises of 5000 protein-ligand complexes chosen from PDB database. The dataset consists of binding affinities along with energy components like electrostatic, van der Waals, polar and non-polar solvation energy calculated from molecular dynamics simulations using MMPBSA (Molecular Mechanics Poisson-Boltzmann Surface Area) method. The initial structures of all the 5000 protein ligand complexes are available in PDB format and the csv file containing information about binding affinity. This work is published in Scientific Data (https://doi.org/10.1038/s41597-022-01631-9)', 1, 'https://healthcare.iiit.ac.in/d4/plas5k/plas5k.html', NULL, 'ZIP', 0, 'APPROVED', 'Data Driven Drug Discovery (D4)'),
('78aec9e3-dbc3-4fe0-912e-7754328566b9', 'amit.pandey@gmail.com', 'http://cvit.iiit.ac.in/autorickshaw_detection/', 'Autorickshaw Detection Challenge Dataset', 'This is a sample dataset for the Autorickshaw detection challenge. The full dataset will be released shortly (see the Timeline in the website: http://cvit.iiit.ac.in/autorickshaw_detection ).ΠThe images folder contains 800 images of autorickshaws. Each images file has a number in its filename.ΠThe bbs folder contains bbs.json file, which contain the ground truth bounding boxes. It is an array of lenth 800. The bounding box information corresponding to the image i.jpg can be found at the ith location in bbs array. The bounding box information is again an array. The length of the array the the number of autorickshaws in the that image. At each index the four vertices of the bounding box is provided. See the view.py script for an example.ΠThe scripts folder contains a file view.py, which opens the image and overlays the bounding boxes (closing the window, will show the next image). It serves as an example on how to view as well load the data format in bbs.json.', 1, 'http://cvit.iiit.ac.in/autorickshaw_detection/', NULL, 'ZIP', 0, 'APPROVED', 'Indian Driving Dataset (IDD)');

-- --------------------------------------------------------

--
-- Table structure for table `DatasetGroups`
--

CREATE TABLE `DatasetGroups` (
  `group_id` varchar(255) NOT NULL,
  `group_name` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `user_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DatasetVersion`
--

CREATE TABLE `DatasetVersion` (
  `dataset_version_id` varchar(255) NOT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `version_data` longblob,
  `version_data_format` varchar(255) DEFAULT NULL,
  `dataset_changes` longblob,
  `changes_format` varchar(255) DEFAULT NULL,
  `version_name` varchar(255) DEFAULT NULL,
  `abstract` text,
  `reference` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `last_edit` datetime DEFAULT NULL,
  `publication_names` text,
  `publication_links` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `DfsUser`
--

CREATE TABLE `DfsUser` (
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) NOT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `user_role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DfsUser`
--

INSERT INTO `DfsUser` (`first_name`, `last_name`, `user_password`, `user_email`, `institution`, `designation`, `user_role`) VALUES
('User', 'Admin', 'Admin123', 'admin@ihub-data.iiit.ac.in', 'IIIT-H', 'SDE-II', 'admin'),
('User', 'User', 'User123', 'user@ihub-data.iiit.ac.in', 'IIIT-H', 'SDE-I', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `Domain`
--

CREATE TABLE `Domain` (
  `domain` varchar(255) NOT NULL,
  `publication_links` text,
  `publication_names` text,
  `publication_format` varchar(255) DEFAULT NULL,
  `abstract_a` text,
  `abstarct_b` text,
  `abstract_c` text,
  `last_addition` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Domain`
--

INSERT INTO `Domain` (`domain`, `publication_links`, `publication_names`, `publication_format`, `abstract_a`, `abstarct_b`, `abstract_c`, `last_addition`) VALUES
('Domain Test', 'NA', 'DFS Admin', 'PDF', '', '', '', '2023-02-13 12:53:44');

-- --------------------------------------------------------

--
-- Table structure for table `Downloads`
--

CREATE TABLE `Downloads` (
  `download_id` int NOT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `dataset_name` varchar(255) DEFAULT NULL,
  `dataset_domain_name` varchar(255) DEFAULT NULL,
  `download_time_stamp` datetime DEFAULT NULL,
  `file_downloads` int DEFAULT NULL,
  `user_first_name` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_country_name` varchar(255) DEFAULT NULL,
  `user_organization_name` varchar(255) DEFAULT NULL,
  `user_ip_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Files`
--

CREATE TABLE `Files` (
  `upfilename` varchar(255) NOT NULL,
  `upfilenameMD` varchar(255) DEFAULT NULL,
  `filetype` varchar(255) DEFAULT NULL,
  `filesize` bigint DEFAULT NULL,
  `database_id` varchar(255) DEFAULT NULL,
  `databaseVersion_id` varchar(255) DEFAULT NULL,
  `comments` text,
  `version_name` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `created_date` varchar(255) DEFAULT NULL,
  `last_edit` varchar(255) DEFAULT NULL,
  `publication_names` text,
  `publication_links` text,
  `verification` varchar(255) DEFAULT NULL,
  `public` varchar(255) DEFAULT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `additional` text,
  `minio` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ModelRequests`
--

CREATE TABLE `ModelRequests` (
  `model_id` varchar(255) DEFAULT NULL,
  `request_id` varchar(255) NOT NULL,
  `request_status` varchar(255) DEFAULT NULL,
  `request_for` varchar(255) DEFAULT NULL,
  `requester_id` varchar(255) DEFAULT NULL,
  `requestee_id` varchar(255) DEFAULT NULL,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Models`
--

CREATE TABLE `Models` (
  `dataset_version_id` varchar(255) DEFAULT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `model_id` varchar(255) NOT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `group_id` varchar(255) DEFAULT NULL,
  `author_id` varchar(255) DEFAULT NULL,
  `author_name` varchar(255) DEFAULT NULL,
  `authors_names` text,
  `authors_ids` text,
  `created_datetime` varchar(255) DEFAULT NULL,
  `last_updated` varchar(255) DEFAULT NULL,
  `updates` int DEFAULT NULL,
  `jsondata` longtext,
  `group_read` tinyint(1) DEFAULT '0',
  `group_write` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Requests`
--

CREATE TABLE `Requests` (
  `upfilename` varchar(255) NOT NULL,
  `upfilenameMD` varchar(255) DEFAULT NULL,
  `requester` varchar(255) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `stat` varchar(255) DEFAULT NULL,
  `comment` text,
  `av1` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Tnc`
--

CREATE TABLE `Tnc` (
  `target_id` varchar(255) NOT NULL,
  `dataset_level` enum('DATASET','FILE') NOT NULL,
  `md_data` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TotalCountryMonthYear`
--

CREATE TABLE `TotalCountryMonthYear` (
  `dataset_id` varchar(255) NOT NULL,
  `dataset_domain_name` varchar(255) NOT NULL,
  `month_id` int NOT NULL,
  `year_id` int NOT NULL,
  `country_name` varchar(255) NOT NULL,
  `total_dataset_downloads` int DEFAULT NULL,
  `total_file_downloads` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TotalDownloads`
--

CREATE TABLE `TotalDownloads` (
  `id` int NOT NULL,
  `dataset_id` varchar(255) DEFAULT NULL,
  `dataset_name` varchar(255) DEFAULT NULL,
  `dataset_domain_name` varchar(255) DEFAULT NULL,
  `total_dataset_downloads` int DEFAULT NULL,
  `total_file_downloads` int DEFAULT NULL,
  `total_users` int DEFAULT NULL,
  `total_organizations` int DEFAULT NULL,
  `total_countries` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TotalDownloadsByDay`
--

CREATE TABLE `TotalDownloadsByDay` (
  `dataset_id` varchar(255) NOT NULL,
  `dataset_domain_name` varchar(255) DEFAULT NULL,
  `day_id` int NOT NULL,
  `month_id` int NOT NULL,
  `year_id` int NOT NULL,
  `total_dataset_downloads` int DEFAULT NULL,
  `total_file_downloads` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TotalDownloadsMonthYear`
--

CREATE TABLE `TotalDownloadsMonthYear` (
  `dataset_id` varchar(255) NOT NULL,
  `dataset_domain_name` varchar(255) NOT NULL,
  `month_id` int NOT NULL,
  `year_id` int NOT NULL,
  `total_dataset_downloads` int DEFAULT NULL,
  `total_file_downloads` int DEFAULT NULL,
  `total_users` int DEFAULT NULL,
  `total_organizations` int DEFAULT NULL,
  `total_countries` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TotalRegisteredUserByOrganizationYearMonth`
--

CREATE TABLE `TotalRegisteredUserByOrganizationYearMonth` (
  `dataset_id` varchar(255) NOT NULL,
  `dataset_name` varchar(255) DEFAULT NULL,
  `dataset_domain_name` varchar(255) NOT NULL,
  `month_id` int NOT NULL,
  `year_id` int NOT NULL,
  `total_registered_user` int DEFAULT NULL,
  `user_organization_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `dfs_user_id` varchar(255) NOT NULL,
  `dfs_user_name` varchar(255) DEFAULT NULL,
  `dfs_user_role` varchar(255) DEFAULT NULL,
  `dfs_user_about` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`dfs_user_id`, `dfs_user_name`, `dfs_user_role`, `dfs_user_about`) VALUES
('025107b6-82ad-47de-9848-2c73eef6d721', 'User', 'user', 'IIIT-H'),
('56106f4d-a316-4871-b7ec-3f3eb85e3a65', 'Admin', 'admin', 'IIIT-H');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `ContactUs`
--
ALTER TABLE `ContactUs`
  ADD PRIMARY KEY (`EMAIL`);

--
-- Indexes for table `DataRequests`
--
ALTER TABLE `DataRequests`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `Dataset`
--
ALTER TABLE `Dataset`
  ADD PRIMARY KEY (`dataset_id`);

--
-- Indexes for table `DatasetGroups`
--
ALTER TABLE `DatasetGroups`
  ADD PRIMARY KEY (`group_id`,`user_id`);

--
-- Indexes for table `DatasetVersion`
--
ALTER TABLE `DatasetVersion`
  ADD PRIMARY KEY (`dataset_version_id`);

--
-- Indexes for table `DfsUser`
--
ALTER TABLE `DfsUser`
  ADD PRIMARY KEY (`user_email`);

--
-- Indexes for table `Domain`
--
ALTER TABLE `Domain`
  ADD PRIMARY KEY (`domain`);

--
-- Indexes for table `Downloads`
--
ALTER TABLE `Downloads`
  ADD PRIMARY KEY (`download_id`);

--
-- Indexes for table `Files`
--
ALTER TABLE `Files`
  ADD PRIMARY KEY (`upfilename`);

--
-- Indexes for table `ModelRequests`
--
ALTER TABLE `ModelRequests`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `Models`
--
ALTER TABLE `Models`
  ADD PRIMARY KEY (`model_id`);

--
-- Indexes for table `Requests`
--
ALTER TABLE `Requests`
  ADD PRIMARY KEY (`upfilename`,`requester`);

--
-- Indexes for table `Tnc`
--
ALTER TABLE `Tnc`
  ADD PRIMARY KEY (`target_id`);

--
-- Indexes for table `TotalCountryMonthYear`
--
ALTER TABLE `TotalCountryMonthYear`
  ADD PRIMARY KEY (`dataset_id`,`dataset_domain_name`,`year_id`,`month_id`,`country_name`);

--
-- Indexes for table `TotalDownloads`
--
ALTER TABLE `TotalDownloads`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_dataset` (`dataset_id`,`dataset_domain_name`);

--
-- Indexes for table `TotalDownloadsByDay`
--
ALTER TABLE `TotalDownloadsByDay`
  ADD PRIMARY KEY (`day_id`,`month_id`,`year_id`,`dataset_id`);

--
-- Indexes for table `TotalDownloadsMonthYear`
--
ALTER TABLE `TotalDownloadsMonthYear`
  ADD PRIMARY KEY (`dataset_id`,`dataset_domain_name`,`year_id`,`month_id`);

--
-- Indexes for table `TotalRegisteredUserByOrganizationYearMonth`
--
ALTER TABLE `TotalRegisteredUserByOrganizationYearMonth`
  ADD PRIMARY KEY (`dataset_id`,`dataset_domain_name`,`year_id`,`month_id`,`user_organization_name`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`dfs_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Downloads`
--
ALTER TABLE `Downloads`
  MODIFY `download_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `TotalDownloads`
--
ALTER TABLE `TotalDownloads`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
