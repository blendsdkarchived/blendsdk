for d in packages/*/ ; do
	cd ./${d}
	ncu -au
	rm -fR package-lock.json
	rm -fR node_modules
	cd ../../
done
lerna bootstrap