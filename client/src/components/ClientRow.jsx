import { FaTrash } from "react-icons/fa"
import { useMutation } from "@apollo/client"
import { DELETE_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queires/clientQueries";

export default function ClientRow({ client }) {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        variables: { id: client.id },
        // now to update the table, onew way is to refetch the clients
        // refetchQueries: [{ query: GET_CLIENTS }],

        // 2nd way is to update the cache with the data returned from the delete mutation
        update(cache, { data: { deleteClient } }) {
            // read the data from the cache wihtout making a new request
            const { clients } = cache.readQuery({
                query: GET_CLIENTS
            });
            cache.writeQuery({
                query: GET_CLIENTS,
                data: {
                    clients: clients.filter(client => client.id !== deleteClient.id)
                },
            });
        }
    });

    return (
        <tr>
            <td>{client.name}</td>
            <td>{client.email}</td>
            <td>{client.phone}</td>
            <td>
                <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                    <FaTrash />
                </button>
            </td>
        </tr>
    )
}
