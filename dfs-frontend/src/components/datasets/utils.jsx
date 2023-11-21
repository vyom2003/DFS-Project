import moment from "moment";
const DATASET_DETAIL_MAP = {
  upfilename: "Uploaded Filename",
  upfilenameMD: "Uploaded File Details (Md)",
  database_id: "Id",
  databaseVersion_id: "Version",
  version_name: "Version Name",
  created_date: "Created",
  last_edit: "Last edited",
  publication_names: "Publication Names",
  publication_links: "Publication Links",
  verification: "Verification Status",
  author_id: "Author Id",
  public: "Access",
};
export const datasetDetailsMap = (value) => DATASET_DETAIL_MAP[value] ?? value;

const isLoggedIn = !!localStorage.getItem("dfs-user");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const datasetDetailsValueMap = (key, value, params = {}) => {

  const {
    reqstatus,
    acceptTnc,
    props,
    download_url,
    download_readme_url,
    setAcceptTnc,
  } = params;
  switch (key) {
    case "last_edit":
      return moment(Number(value)).format("DD/MM/YYYY (on hh:mm:ss A)");
    case "created_date":
      return moment(Number(value)).format("DD/MM/YYYY (on hh:mm:ss A)");
    case "upfilename":
      return reqstatus === "accepted" ? (
        <span>
          {acceptTnc && isLoggedIn ? (
            <>
              <a
                className="pr-3 py-1 break-words text-blue-500"
                href={download_url}
                target="_blank"
                rel="noreferrer"
              >
                {props.targetElement?.upfilename}
              </a>
            </>
          ) : (
            <>
              <input
                className="py-1"
                type="checkbox"
                onChange={() => setAcceptTnc((a) => !a)}
              />
              <label style={{ marginLeft: "5px" }}>
                I accept the{" "}
                <a href={"/tnc/" + props.targetElement.database_id} className="text-blue-500">
                  terms and conditions
                </a>
              </label>
            </>
          )}
        </span>
      ) : (
        <a className="text-red-500" href="/sign-in">
          Sign in to Download
        </a>
      );
    case "upfilenameMD":
      return reqstatus === "accepted" ? (
        <span>
          {acceptTnc && isLoggedIn ? (
            <a
              className="pr-3 py-1 break-words text-blue-500"
              href={download_readme_url}
              target="_blank"
              rel="noreferrer"
            >
              {props.targetElement?.upfilenameMD}
            </a>
          ) : (
            <>
              <input type="checkbox" onChange={() => setAcceptTnc((a) => !a)} />
              <label style={{ marginLeft: "5px" }}>
                I accept the{" "}
                <a
                  href={"/tnc/" + props.targetElement.database_id}
                  className="text-blue-500"
                >
                  terms and conditions
                </a>
              </label>
            </>
          )}
        </span>
      ) : (
        <a className="text-red-500" href="/sign-in">
          Sign in to Download
        </a>
      );
    case "reference":
      return (
        <a href={value}>
          {value.length > 53 ? value.slice(0, 50) + "..." : value}
        </a>
      );
    case "public":
      return capitalizeFirstLetter(value);
    case "verification":
      return capitalizeFirstLetter(value);
    default:
      return value;
  }
};
