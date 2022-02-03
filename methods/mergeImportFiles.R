# This script will first convert all Excel files into separte folders with individual files for each sheet
# Then it will import the separate sheets into a specified collection (set in .env file)
library(readr)
suppressWarnings(suppressMessages(library(dplyr)))
library(readxl)
library(stringr)

# convert to single sheet csv files and store in separate directories for each file
getdata_mapped <- function(inputfile, id1, id2) {
  name = tools::file_path_sans_ext(inputfile)
  dir.create(name, showWarnings = FALSE)
  sheets <- readxl::excel_sheets(inputfile)
  # we will only import one of the following sheets
  accepted = c('Basic Data', 'Racial and Ethnic Identifiers', 'Ed & Career', 'Electoral Politics', 'Leadership in Org', 'Organizational and Political', 'Role at NWC', 'Sources')
  
  for (x in sheets) {
    if (!x %in% accepted ) {
      next
    }
    print(paste0('Creating ', x, '.csv'))
    df1 <- readxl::read_excel(inputfile, sheet = x, col_types = "text") %>%
        mutate(ID = str_pad(ID, 4, pad = "0"))
    if (exists('mapping') & ncol(mapp_df) == 4) {
       df2 <- df1 %>%
        filter(ID == id1 | ID == id2)
    } else {
      df2 <- df1
    }
    
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

# iterate over files in input directory
files<-list.files(path=directory, pattern='xlsx', full.names = TRUE)
mapping <- list.files(path=directory, pattern='csv', full.names = TRUE)

if (exists('mapping')) {
  print(paste('Found mapping file: ', mapping))
  mapp_df <- read_csv(mapping)  
} else {
  abort("Abort. Please provide a mapping file.")
}

for (inputfile in files){
    print(paste('Starting import for file: ', inputfile))
    file <- tools::file_path_sans_ext(basename(inputfile))
    if (exists('mapping') & ncol(mapp_df) == 4) {
      # STEP 1: get mapping information
      ids <- mapp_df %>% filter(str_detect(`File Name`, file))
      # STEP 2: read Excel sheets, keep only rows according to mapping
      import_directory = getdata_mapped(inputfile, ids$`ID Code 1`[1], ids$`ID Code 2`[1])
      note <- paste(mapp_df[1,4], file)
    } else {
      import_directory = getdata_mapped(inputfile)
      note <- paste(mapp_df[1,2], file)
    }

    # STEP 3: import into DB
    print("Call import.")
    execute_import_command = paste0('node import_participants --directory \"', import_directory, '\"', ' --note \"', note, '\" -b -a -e -p -r -l -o')
    try(system(execute_import_command, intern = FALSE))
}



