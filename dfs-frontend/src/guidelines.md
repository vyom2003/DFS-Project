# Code guidelines

  

## IMPORT ORDER

- Categorize imports in the following categories in the following order: 
	- `Libs (react imports, axios etc)`
	- `Components`
	- `Constants`
	- `Style / Styled components`
	- `Style-sheets`

## Folder structure
1. `/Containers` 
	- Each route has a corresponding container. 
	- This will be the only part of code that can read the react-router passed params.
	- Smaller components will export directly from the folder from a single file `/<ComponentName>.jsx` and for larger components, we will follow the following structure:
		- `/index.jsx` file exporting the main component
		- `/<ComponentName>` file with the main component
		- `/Components` folder with sub-components which will each recursively follow the same structure
		- `/hooks` for all custom hooks created.
		- `/contexts` for any custom contexts created.
2. `/Components`
	-	Will follow same structure as Container/Component. These are components reused across multiple components, or subcomponents.
3. `/Utils`
	- Will hold categorized files that do not export any components. 
4. `Constants`
	- Will hold all constants used throughout the app. All constants will be in capitals, and will be descriptive 

## Coding practices recommended
1. Run prettier before pushing any code
2. Make sure you have tested all your code changes on your end before you request a review. Address every review comment you get and before requesting another review, make sure you test the code for all edge scenarios.
3. As much as possible, move code outside the component functions. Memoize functions and components when and only when needed.
4. Attach screenshots / screen recordings to pull requests that involve ui / ux changes.
5. Use tombstones instead of `<p>Loading</p>` for all further prs. refer to https://codesandbox.io/s/serene-field-ffqgrg?file=/src/App.js. The objective is to ensure smooth transition and snappy ux regardless of network speeds.
6. Ensure that the previous changes were not hampered with, and all other features that were overlapping, are still working as expected.
7. Reduce individual file sizes and component sizes as much as possible. The major optimization react allows is selective re-rendering. We can exploit it by making localized components and using memos. Added benifit: it makes code easier to read!
8. Follow semantic commit messages on all comments, https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716


## Major upcoming tasks
1. Major refactoring to fit above standards
2. Typescript migration
3.  Stablility changes (in parallel to above two, based on need)