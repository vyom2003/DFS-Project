
use dfsdata;

CREATE TABLE DfsUser (
    first_name varchar(255),
    last_name varchar(255),
    user_password varchar(255),
    user_email varchar(255),
    institution varchar(255),
    designation varchar(255),
    user_role varchar(255),
    registry_time BIGINT,
    timezone varchar(255),
    userDetailsJson text,
    PRIMARY KEY (user_email)
);

CREATE TABLE Requests(
    upfilename varchar(255),
    upfilenameMD varchar(255),
    requester varchar(255),
    author varchar(255),
    stat varchar(255),
    comment text,
    av1 text,
    PRIMARY KEY(upfilename, requester)
);

CREATE TABLE Domain(
    domain varchar(255),
    publication_links text,
    publication_names text,
    publication_format varchar(255),
    abstract_a text,
    abstarct_b text,
    abstract_c text,
    last_addition datetime,
    PRIMARY KEY(domain)
);

CREATE TABLE Dataset(
    dataset_id varchar(255),
    author_id varchar(255),
    reference_list mediumtext,
    dataset_name varchar(255),
    dataset_description text,
    public boolean,
    source varchar(255),
    dataset_data LONGBLOB,
    dataset_format varchar(255),
    temporary boolean, -- change to listed
    dataset_status varchar(255),
    domain varchar(255),
    PRIMARY KEY (dataset_id)
);

CREATE TABLE Comments (
    discussion_id varchar(255),
    comment_id varchar(255), -- discussion id is same comment id for a discussion comment 
    comment text,
    format varchar(255),
    tags varchar(255), -- comma separated words with hashes, note: can be ids as well.
    group_id varchar(255),
    author_id varchar(255),
    alias varchar(255),
    dataset_version_id varchar(255),
    comment_date BIGINT,
    edit_date BIGINT,
    PRIMARY KEY (comment_id)
);

-- filetype, upfilename, databaseId, databaseVersionId, comments
CREATE TABLE Files(
    upfilename varchar(255),
    upfilenameMD varchar(255),
    filetype varchar(255),
    database_id varchar(255),
    databaseVersion_id varchar(255),
    comments text,
    version_name varchar(255),
    reference varchar(255),
    created_date varchar(255),
    last_edit varchar(255),
    publication_names text,
    publication_links text,
    verification varchar(255),
    public varchar(255),
    author_id varchar(255),
    additional text,
    PRIMARY KEY (upfilename)
)

CREATE TABLE Models(
    dataset_version_id varchar(255),
    dataset_id varchar(255),
    domain varchar(255),
    model_id varchar(255),
    model_name varchar(255),
    group_id varchar(255),
    author_id varchar(255),
    author_name varchar(255),
    authors_names text,
    authors_ids text,
    created_datetime varchar(255),
    last_updated varchar(255),
    updates INT,
    jsondata LONGTEXT,
    PRIMARY KEY (model_id)
);

CREATE TABLE ModelRequests(
    model_id varchar(255),
    request_id varchar(255),
    request_status varchar(255),
    request_for varchar(255),
    requester_id varchar(255),
    requestee_id varchar(255), -- join tables later, but for now assuming only author can be requestee
    comment text,
    PRIMARY KEY (request_id)
)

CREATE TABLE Tnc(
    target_id varchar(255) NOT NULL,
    dataset_level ENUM('DATASET', 'FILE') NOT NULL,
    md_data LONGTEXT,
    PRIMARY KEY (target_id)
)

CREATE TABLE DatasetGroups(
    group_id varchar(255),
    group_name varchar(255),
    user_id varchar(255),
    user_role varchar(255),
    PRIMARY KEY (group_id, user_id)
);

-- Dataset Downloads Stats:
-- Create these tables before running the script. 
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

-- alter table ModelRequests add comment text;
-- alter table Models add group_read boolean default false;
-- alter table Models add group_write boolean default false;