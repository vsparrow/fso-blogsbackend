if [ -z "$1" ] || [ $1 = "?" ] || [ $1 = "help" ]
then
	echo
	echo "GET BLOGS: kurl gb"
	echo "POST BLOG: kurl pb"
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
	curl http://localhost:3003/api/blogs -X POST --header "Content-Type:application/json" -d '{"title":"no_title", "author":"no_author", "url":"no_url", "userId": "5e13ddcc43a2c20ae79ecd36"}'	
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
	curl http://localhost:3003/api/users -X POST --header "Content-Type:application/json" -d '{"username":"username001", "name":"steve rogers", "password":"avengers"}'	
	echo
	echo "GET USERS"
	curl http://localhost:3003/api/users
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