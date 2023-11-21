# <b>Custom C Shell</b>
A basic shell made as a part of Operating Systems and Networks course.
<hr>

## Bhvya Kothari <b>| 2021101041</b>
<hr>

# <b>Functionality</b>
- Prompt with username, hostname and directory
- Basic commands : cd, pwd, echo, ls, discover, pinfo
- Ability to run external commands as foreground and background.
<hr>

# <b>Installation</b>
1. Run <mark style="background-color: grey; border-radius: 5px; border-">make</mark> to build the executable
2. Run <mark style="background-color: grey; border-radius: 5px"> ./shell</mark> to start the shell
# <b>File & Functions</b>
## <b>Supporting Files</b>
#### Files containing functions required for proper functioning of the shell.

- <mark style="background-color: grey; border-radius: 5px">main.c</mark>
> Run shell loop

> Extract command from input and tokenise them based on ; and  &

> Tokenise the input furthur and store them as words

> According to command to execute redirect the tokenised input to respective functions
- <mark style="background-color: grey; border-radius: 5px">prompt.c</mark>
> Print prompt

- <mark style="background-color: grey; border-radius: 5px">history.c</mark>
> Adds command to history

> Stores maximum of 20 commands

> Prints the last 20 commands

> Takes in an arguement(integer) from the user between 0-20.

## <b>Command Files</b>
- <mark style="background-color: grey; border-radius: 5px">pwdd.c</mark>
> Prints the working directory
- <mark style="background-color: grey; border-radius: 5px">echo.c</mark>
> Prints user input after removing excess spaces/tabs

- <mark style="background-color: grey; border-radius: 5px">ls.c</mark>
> Prints all files/sub-directories in a location

> Flags implemented: a, l, al, la

> Multiple directories supported

- <mark style="background-color: grey; border-radius: 5px">cd.c</mark>
> Navigate to different directories

- <mark style="background-color: grey; border-radius: 5px">pinfo.c</mark>
> Prints info about process with given PID (current process if none is given)

- <mark style="background-color: grey; border-radius: 5px">discover.c</mark>
> Emulates the basics of the find command

> Flags implemented : d,f

> If finds target file recursively within target directory(if mentioned else current directory) and printd its path

> Also finds hidden files

<hr>

# <b>Assumptions</b>

- Reasonable assumptions are made for things like length of current path, number of commands, command length, etc. The shell will work perfectly for all "day to day work".

- File and directory names shouldn't contain spaces or special characters.

- <mark style="background-color: grey; border-radius: 5px">pinfo</mark> may break on systems not running Ubuntu. This command uses <mark style="background-color: grey; border-radius: 5px">/proc</mark> files which may not be same for other OS.

- Every user input will be stored as it is in history, given it is not same as the last input and contains at least one character other than space or tab or enter.

- Prompt will display only terminated normally or terminated abnormally when a background process ends.

- Prompt will check exist status of background processes only after user inputs a command (possibly empty). The same happens in actual Bash shell.

- Any error while running a command will result in aborting the command after printing an error message.

- <mark style="background-color: grey; border-radius: 5px">&</mark> (used for running process in background) can come anywhere in command.

- A file <mark style="background-color: grey; border-radius: 5px">(history.txt)</mark> is used to store history in a readable format. Any changes explicitly done in this file may result in unexpected output of <mark style="background-color: grey; border-radius: 5px">history</mark> command.










