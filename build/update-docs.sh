cd docs
rm -rf _book
gitbook build
cp _circle.yml _book/circle.yml
cp CNAME _book/CNAME
cd _book
git init
git add -A
git commit -m 'update book'
git push -f git@github.com:vuejs/vue-router.git master:gh-pages
