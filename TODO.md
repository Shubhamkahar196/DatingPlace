# TODO: Enable Full Chat on Match Found

## Steps to Complete

1. **Update Sidebar.tsx**: Add navigation to chat page after successfully accepting a friend request.
   - Import `useNavigate` from `react-router-dom`.
   - In the accept button's onClick handler, after `acceptFriendRequest(request._id)` succeeds, navigate to `/chat/${request._id}`.

2. **Update HomePage.tsx**: Add navigation to chat page after successfully accepting a friend request.
   - Import `useNavigate` from `react-router-dom`.
   - In the "Accept Request" button's onClick handler, after `acceptFriendRequest(user._id)` succeeds, navigate to `/chat/${user._id}`.

3. **Test the Acceptance Flow**: Run the frontend and backend, simulate accepting a friend request, and verify navigation to the chat page with real-time messaging.

## Notes
- Ensure navigation only happens on success to avoid errors.
- Real-time messaging is already implemented via sockets in ChatPage.tsx and useMessageStore.ts.
- Completed steps 1 and 2.
