# This script will convert all Excel files into separate folders with individual files for each sheet. It can also be used to convert a single Excel file into individual csv files for each sheet.
library(readr)
suppressWarnings(suppressMessages(library(dplyr)))
library(readxl)
library(stringr)

# convert to single sheet csv files and store in separate directories for each file
getdata_mapped <- function(inputfile, id1, id2) {
  name <- tools::file_path_sans_ext(inputfile)
  dir.create(name, showWarnings = FALSE)
  sheets <- readxl::excel_sheets(inputfile)
  # we will only import one of the following sheets
  accepted <- c("Basic Data", "Race & Ethnicity--Expanded", "Ed & Career", "Electoral Politics", "Leadership in Org", "Organizational & Political", "Role at NWC")

  for (x in sheets) {
    if (!x %in% accepted) {
      next
    }
    print(paste0("Creating ", x, ".csv"))
    df1 <- readxl::read_excel(inputfile, sheet = x, col_types = "text") %>%
      mutate(ID = str_pad(ID, 4, pad = "0"))
    if (length(mapping) != 0) {
      df2 <- df1 %>%
        filter(ID == id1 | ID == id2)
    } else {
      df2 <- df1
    }

    filename <- paste0("data/", x, ".csv")
    write_csv(df2, filename)
  }
  return(name)
}

# Checking arguments
# !/usr/bin/env Rscript
args <- commandArgs(trailingOnly = TRUE)

if (length(args) == 0) {
  stop("At least one argument must be supplied (input file).n", call. = FALSE)
} else {
  print(paste("Number of arguments parsed:", length(args)))
}

# assign directory from args e.g. '/Users/plindner/importdata'
directory <- args[1]
print(paste("Read files in directory: ", directory))

# iterate over files in input directory
files <- list.files(path = directory, pattern = "xlsx", full.names = TRUE)
mapping <- list.files(path = directory, pattern = "csv", full.names = TRUE)

#create directory for csv files if not exists already
sub_dir <- "data"

if (!dir.exists(sub_dir)) {
  dir.create(sub_dir)
}

for (inputfile in files) {
  print(paste("Starting import for file: ", inputfile))
  file <- tools::file_path_sans_ext(basename(inputfile))
  if (length(mapping) != 0) {
    print(paste("Found mapping file: ", mapping))
    mapp_df <- read_csv(mapping)
    if (ncol(mapp_df) == 4) {
      # STEP 1: get mapping information
      ids <- mapp_df %>% filter(str_detect(`File Name`, file))
      # STEP 2: read Excel sheets, keep only rows according to mapping
      import_directory <- getdata_mapped(inputfile, ids$`ID Code 1`[1], ids$`ID Code 2`[1])
      note <- paste(mapp_df[1, 4], file)
    } else {
      stop("Mapping file format not correct.")
    }
  } else {
    print("Not using a mapping file")
    import_directory <- getdata_mapped(inputfile)
  }
}
