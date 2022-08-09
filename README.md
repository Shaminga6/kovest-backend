# React-Kovest-API
API to power React-Kovest server side.

# api
path "/v1"

# auth paths
login [post] "/auth/login"
signup [post] "/auth/signup"
logout [post] "/auth/logout"

# goals path
get user's goals [get] "/goals/fetch"
create goal [post] "/goals/create"

# user path
add user's card [put] "/user/card"
get user [get] "/user/me"


# transaction path
get all user's transaction [get] "/user/transaction"