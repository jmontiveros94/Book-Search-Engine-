// imports gql from apollo/client
import { gql } from '@apollo/client';

// gets user's data with properties
export const GET_ME = gql`
    query me {
        me {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            title
            description
            image
            link
            }
        }
    }
`;