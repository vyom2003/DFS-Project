import { Heading } from "../../components/styled/Text";
import { withAuth } from "../../withAuth";

const Me = ({ user }) => {
  console.log(user);
  return       <div className="flex flex-col gap-y-7 my-7 w-full px-10">
  <div className="w-full bg-white rounded-xl p-6">
    <Heading>User Details</Heading>
    <table className="w-full">
    <tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> First Name </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.first_name}</td>
      </tr><tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> Last Name </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.last_name}</td>
      </tr><tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> Registered Email </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.user_email}</td>
      </tr><tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> Institution </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.institution}</td>
      </tr><tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> Designation </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.designation}</td>
      </tr><tr>
        <td className="px-3 py-1 break-words bg-table-shade border border-shade-400"> Role (DFS) </td>
        <td className="px-3 py-1 break-words bg-white border border-shade-400">{user.user.user_role}</td>
      </tr>
    </table>
  </div></div>;
};

export default withAuth(Me);
