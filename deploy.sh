#! /bin/bash

echo -e "\033[36m[SYNC]\033[0m Execute: git checkout gh-pages"
git checkout gh-pages
echo -e "\033[36m[SYNC]\033[0m Done"
echo -e "\033[36m[SYNC]\033[0m Execute: git merge master"
git merge master
echo -e "\033[36m[SYNC]\033[0m Done"
echo -e "\033[36m[SYNC]\033[0m Execute: git push"
git push
echo -e "\033[36m[SYNC]\033[0m Done"
echo -e "\033[36m[SYNC]\033[0m Execute: checkout master"
git checkout master
echo -e "\033[36m[SYNC]\033[0m Done"
echo -e "\033[36m[SYNC]\033[0m All done"