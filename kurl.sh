if [ -z "$1" ] || [ $1 = "?" ] || [ $1 = "help" ]
then
	echo
	echo "GET BLOGS: kurl gb"
	echo "POST BLOG: kurl pb"
	echo "POST LOGIN: kurl li"
	echo "unknown endpoint: kurl u"
elif [ $1 = "position" ]
then
	echo "Positional Parameters"
	echo '$0 = ' $0
	echo '$1 = ' $1
	echo '$2 = ' $2
	echo '$3 = ' $3
elif [ $1 = "gb" ] # GET /api/blogs
then
	echo
	echo "GET BLOGS"
	curl http://localhost:3003/api/blogs
	echo
elif [ $1 = "pb" ] # POST /api/blogs
then
	echo
	echo "POST BLOGS"
	token=$(curl http://localhost:3003/api/login -X POST --header "Content-Type:application/json" -d '{"username":"username001",  "password":"avengers"}'  | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["token"]')
	curl http://localhost:3003/api/blogs -X POST --header "Content-Type:application/json" -d '{"title":"jwt_title4", "author":"jwt_author4", "url":"jwt_url4"}' -H "Authorization: Bearer $token"	
	echo
	echo "GET BLOGS"
	curl http://localhost:3003/api/blogs
	echo
# ********************************
elif [ $1 = "gu" ] # GET /api/blogs
then
	echo
	echo "GET USERS"
	curl http://localhost:3003/api/users
	echo
elif [ $1 = "pu" ] # POST /api/blogs
then
	echo
	echo "POST USERS"
	curl http://localhost:3003/api/users -X POST --header "Content-Type:application/json" -d '{"username":"username003", "name":"tony hawk", "password":"avengers"}'	
	echo
	echo "GET USERS"
	curl http://localhost:3003/api/users
	echo
# ********************************	
elif [ $1 = "li" ] # POST /api/login
then
	echo
	echo "POST LOGIN"
	output=$(curl http://localhost:3003/api/login -X POST --header "Content-Type:application/json" -d '{"username":"username001",  "password":"avengers"}')	
	echo "$output"
	echo
	echo "token is:"
	echo "$output"  | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["token"]'
	echo
# ********************************	
elif [ $1 = "u" ] # GET some unknown endpoint 
then
	echo
	echo "TEST unknownEndpoint"
	curl http://localhost:3003/somerandomroute
	echo
else 
	echo
	echo "kurl ?  for more information on how to use"
	echo
fi