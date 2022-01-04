# This script will first convert all Excel files into separte folders with individual files for each sheet
# Then it will import the separate sheets into a specified collection (set in .env file)
library(readr)
library(dplyr)
library(readxl)
library(stringr)

getdata_mapped <- function(inputfile, id1, id2) {
  name = tools::file_path_sans_ext(inputfile)
  dir.create(name)

  sheets <- readxl::excel_sheets(inputfile)
  
  accepted = c('Basic Data.csv', 'Racial and Ethnic Identifiers', 'Ed & Career', 'Electoral Politics', 'Leadership in Org', 'Organizational and Political', 'Role at NWC', 'Sources')
  
  for (x in sheets) {
    if (!x %in% accepted ) {
      next
    }
    print(paste0('Will create ', x, '.csv'))
    df2 <- readxl::read_excel(inputfile, sheet = x, col_types = "text") %>%
      mutate(ID = str_pad(ID, 4, pad = "0")) %>%
      filter(ID == id1 | ID == id2)
    
    filename = file.path(name, paste0(x, '.csv'))
    write_csv(df2, filename)
  }
  return(name)
}
  
# Checking arguments
#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

if (length(args)==0) {
  stop("At least one argument must be supplied (input file).n", call.=FALSE)
} else {
  print(paste("Number of arguments parsed:", length(args)))
}

# assign directory from args e.g. '/Users/plindner/Development/NWC_backend/data/single_sample'
directory <- args[1]
print(paste('Read files in directory: ', directory))
mapping <- file.path(directory, args[2])
print(paste('Found mapping file: ', mapping))

mapp_df <- read_csv(mapping)

# iterate over files in
# that directory
files<-list.files(path=directory, pattern='xlsx', full.names = TRUE)
for (inputfile in files){
    print(paste('Starting import ...', inputfile))
    # STEP 1: get mapping information
    file <- tools::file_path_sans_ext(basename(inputfile))
    ids <- mapp_df %>% filter(str_detect(`File Name`, file))
    # STEP 2: read Excel sheets, keep only rows according to mapping, convert to single sheet csv files and store in separate   directories for each file
    if (length(args) == 2) {
      import_directory = getdata_mapped(inputfile, ids$`ID Code 1`[1], ids$`ID Code 2`[1])
    } else {
      getdata_mapped(inputfile)
    }
    # STEP 3: import into DB
    execute_import_command = paste0('node import_participants --directory \"', import_directory, '\" -b -a -e -p -r -l -o -s')
    try(system(execute_import_command, intern = FALSE))
}



