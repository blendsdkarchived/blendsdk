for d in packages/*/ ; do
	cd ./${d}
	ncu -u
	rm -fR package-lock.json
	rm -fR node_modules
	cd ../../
done
lerna bootstrap