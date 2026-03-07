@echo off
echo Running Git Commands... > push_log.txt
git add . >> push_log.txt 2>&1
echo Committing... >> push_log.txt
git commit -m "update" >> push_log.txt 2>&1
echo Pushing... >> push_log.txt
git push origin main >> push_log.txt 2>&1
echo Done. >> push_log.txt
