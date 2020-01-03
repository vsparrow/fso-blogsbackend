if [ $1 = "position" ]
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
	curl http://localhost:3003/api/blogs -X POST --header "Content-Type:application/json" -d '{"title":"sometitle"}'	
	echo
	echo "GET BLOGS"
	curl http://localhost:3003/api/blogs
	echo
fi