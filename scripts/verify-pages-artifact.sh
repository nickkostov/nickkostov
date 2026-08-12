#!/bin/sh

set -eu

site_dir=$(mktemp -d)
cleanup() {
    rm -rf "$site_dir"
}
trap cleanup EXIT INT TERM

mkdir "$site_dir/content" "$site_dir/resume"
cp index.html javascript.js style.css "$site_dir/"
cp content/content.json "$site_dir/content/"
cp resume/resume.pdf "$site_dir/resume/"

for required_file in index.html javascript.js style.css content/content.json resume/resume.pdf; do
    test -s "$site_dir/$required_file"
done

test ! -e "$site_dir/README.md"
test ! -e "$site_dir/docs"
test ! -e "$site_dir/tests"

echo "Pages artifact contains only the required runtime files."
