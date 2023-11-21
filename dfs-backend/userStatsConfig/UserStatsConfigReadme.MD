# Dataset Downloads Stats:
### Step-1: -- Create these tables before running the script. 
```
CREATE TABLE Downloads (
	download_id INT AUTO_INCREMENT,
	dataset_id varchar(255),
	dataset_name varchar(255),
	dataset_domain_name varchar(255),	
	download_time_stamp datetime,
	file_downloads INT,
	user_first_name varchar(255),
	user_email varchar(255),
	user_country_name varchar(255),
	user_organization_name varchar(255),
	user_ip_address varchar(255),
	PRIMARY KEY (download_id)
);
```
```
CREATE TABLE TotalDownloads (
	dataset_id varchar(255),
	dataset_name varchar(255),
	dataset_domain_name varchar(255),
	total_dataset_downloads INT,
	total_file_downloads INT,
	total_users INT,
	total_organizations INT,
	total_countries INT,
	PRIMARY KEY (dataset_id, dataset_domain_name)
);
```
```
CREATE TABLE TotalDownloadsMonthYear (
	dataset_id varchar(255),
	dataset_domain_name varchar(255),
	month_id  INT,
	year_id  INT,
	total_dataset_downloads INT,
	total_file_downloads INT,
	total_users INT,
	total_organizations INT,
	total_countries INT,
	PRIMARY KEY (year_id, month_id, dataset_id)
);
```
```
CREATE TABLE TotalDownloadsByDay (
	dataset_id varchar(255),
	dataset_domain_name varchar(255),
	day_id INT,
	month_id INT,
	year_id INT,
	total_dataset_downloads INT,
	total_file_downloads INT,
	PRIMARY KEY (year_id, month_id, day_id, dataset_id)
);
```
```
CREATE TABLE TotalCountryMonthYear (
	dataset_id varchar(255),
	dataset_domain_name varchar(255),
	month_id INT,
	year_id INT,
	country_name varchar(255),
	total_dataset_downloads INT,
	total_file_downloads INT,
	PRIMARY KEY (month_id, year_id, dataset_id, country_name)
);
```
```
CREATE TABLE TotalRegisteredUserByOrganizationYearMonth (
	dataset_id varchar(255),
	dataset_name varchar(255),
	dataset_domain_name varchar(255),
	month_id  INT,
	year_id  INT,
	total_registered_user INT,
	user_organization_name varchar(255),
	PRIMARY KEY (month_id, year_id, dataset_id, dataset_name, user_organization_name)
)
```
### Step-2: Upload data from the file "Downloads.csv" into the "Downloads" table.

### Step-3: Run the following python script:
	```
		node subTableFillConfigFromDownloads.js
	```
After running the script all sub table will filled with updated records.

