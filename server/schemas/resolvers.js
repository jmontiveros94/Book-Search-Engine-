// import the models
const { User, Book } = require('../models');
// import signToken function and AuthError class from Apollo Server package
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // gets a single user
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedBooks')

                return userData;
            }

            throw AuthenticationError;
        }
    },

    Mutation: {
        // finds a user but waits for an email and a password
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            console.log(user)
            // otherwise error is thrown
            if(!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw AuthenticationError;
            }

            // if email and password criteria are met the th user is assigned a token
            const token = signToken(user);
            return { token, user };
        },

        // adds a user to the database and returns a token for them
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        // saves a book to a users saved books by _id
        saveBook: async (parent, { bookData }, context) => {
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData }},
                    { new: true }
                );

                return updatedUser;
            }
            // otherwise it throws an error 
            throw AuthenticationError;
        },

        // removes a book from the users saved books by _id 
        removeBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId }}},
                    { new: true }
                );

                return updatedUser;
            }
            // otherwise an error is thrown
            throw AuthenticationError;
        }
    },
};
//exports the resolvers
module.exports = resolvers;