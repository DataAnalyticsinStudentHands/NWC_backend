# Script to convert existing Excel data files into the new template format. 
# It fixes the name column for all non basic data sheets (e.g. removes middle name column and combines first name and last name).
# It is recommended to run this script if the Pre-Flight check lists general issues with column names.
# Users are expeced to fix issues with sheet names manually (the error message will say what it expects) nad the tool lists the file name that has issues.
# Makes heavily use of openxlsx library - https://ycphs.github.io/openxlsx/reference/index.html
library(openxlsx)
library(dplyr)
library(readxl)
library(stringr)
library(scales)

# Prepare source data (HAS TO BE IN SEPARATE FOLDER) and name of output file --------------------------------------------------------
## Data will also be merged if multiple files are found (check that you only have files there that need to be fixed/merged)
source_folder <- 'DataDirectory/Nevada/Nevada Young Fall 2022'
output_filename <- 'Nevada_Merged_2023-10-17_PL.xlsx'

## list all source files found in folder
files <- list.files(source_folder, full.names = TRUE, recursive = TRUE, pattern = "xlsx") 
files <- as.data.frame(files)
## get names of all sheets in source files
file_sheets <- purrr::flatten_chr(purrr::map(files$files, excel_sheets))

# Prepare output data --------------------------------------------------------
## Create a new workbook
wb <- createWorkbook()

## Read/Add the validations sheet - we use those cells to create the drop-downs
addWorksheet(wb, "Validations")
validations <- read_excel("template.xlsx", col_types = 'text', sheet = "Validations")
writeData(wb, validations, sheet="Validations", rowNames=FALSE, startRow=1)

## Define cell styles to be applied later
bodyStyle <- createStyle(fontSize = 12, border = "TopBottomLeftRight", borderColour = "black", wrapText = TRUE)
coloredStyle <- createStyle(fontSize = 12, border = "TopBottomLeftRight", borderColour = "black", wrapText = TRUE, bgFill = "orange") 
numStyle <- createStyle(fontSize = 12, border = "TopBottomLeftRight", borderColour = "black", wrapText = TRUE, numFmt = "#,###")

## Wrapper for Excel data reading with print statement
read_demographic_data <- function(file, sheet) {
  print(paste("Reading", sheet, "sheet from: ", file))
  read_excel(file, col_types = 'text', .name_repair="universal", sheet = sheet)
}

# BASIC DATA -----------------------------------------------------------------------------
## Read basic data template 
basic_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Basic Data") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read basic data sheet from all files, clean/rename column names to avoid issues
basic_file_data <- purrr::map_dfr(files$files, sheet = "Basic Data", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Middle Name and/or Initial 1` =  if("Middle.Name.and.or.Initial.and.or.Nickname" %in% colnames(.)) `Middle.Name.and.or.Initial.and.or.Nickname`) %>% #if condition takes care if new template is being used
  rename(`Last Name` =  `Last.Name`,                                                              
         `First Name` = `First.Name`,                                                             
         `Age in 1977` =  `Age.in.1977`,
         `Place of Birth` = `Place.of.Birth`, 
         `Total Population of Place of Residence (check US Census)` = `Total.Population.of.Place.of.Residence..check.US.Census.`,
         `Median Household Income of Place of Residence (check US Census)` =  `Median.Household.Income.of.Place.of.Residence..check.US.Census.`,
         `Marital Classification` = `Marital.Classification`,                  
         `Sexual Orientation` =  `Sexual.Orientation`,                   
         `Total Number of Children (born throughout lifetime)` = `Total.Number.of.Children..born.throughout.lifetime.`) %>%
  mutate(`Birthdate Month` = if("Birthdate" %in% colnames(.)) `Birthdate`) %>%
  mutate(`Deathdate Month` = if("Date.of.Death" %in% colnames(.)) `Date.of.Death`) %>%
  select(-any_of(c("Birthdate", "Date.of.Death"))) %>%
  mutate(`Median Household Income of Place of Residence (check US Census)` = as.numeric(`Median Household Income of Place of Residence (check US Census)`)) %>%
  mutate(`Median Household Income of Place of Residence (check US Census)` = scales::dollar(`Median Household Income of Place of Residence (check US Census)`, largest_with_cents = 0)) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a 
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the basic data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Basic Data")
basic_data <- full_join(basic_template, basic_file_data) %>%
  select(-`Residence.in.1977`,
         -starts_with("Latitude"),
         -starts_with("Longitude"), 
         -starts_with("Name.of.Spouse"))

writeData(wb, basic_data, sheet="Basic Data", rowNames=FALSE, startRow=1)

## Add basic data validation with drop-downs
dataValidation(wb, sheet="Basic Data",
               col = 10, rows = 2:(nrow(basic_data)+1), type = "list", 
               value = "'Validations'!$A$2:$A$2") # ca
dataValidation(wb, sheet="Basic Data",
               col = 24, rows = 2:(nrow(basic_data)+1), type = "list", 
               value = "'Validations'!$B$2:$B6") # marital class
dataValidation(wb, sheet="Basic Data",
               col = 26, rows = 2:(nrow(basic_data)+1), type = "list", 
               value = "'Validations'!$C$2:$C5") # gender
dataValidation(wb, sheet="Basic Data",
               col = 27, rows = 2:(nrow(basic_data)+1), type = "list", 
               value = "'Validations'!$D$2:$D4") # sexual_orientation

## apply styles and set row height for header column
addStyle(wb, sheet = "Basic Data", style = bodyStyle, rows=1:(nrow(basic_data)+1), cols=1:ncol(basic_data), gridExpand = TRUE)
addStyle(wb, sheet = "Basic Data", style = numStyle, rows=1:(nrow(basic_data)+1), cols = c(22), gridExpand = TRUE)
conditionalFormatting(wb, sheet = "Basic Data", rows=1:(nrow(basic_data)+1), cols=c(4,5,6), rule="!=0", style = coloredStyle)
conditionalFormatting(wb, sheet = "Basic Data", rows=1:(nrow(basic_data)+1), cols=c(4,5,6), rule="==0", style = coloredStyle)
setRowHeights(wb, "Basic Data", rows = 1, heights = 256)

# RACE & ETHNICITY ---------------------------------------------------------------
## Read reg race data template
race_reg_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Race & Ethnicity--Reg Forms") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read reg race data sheet from all files, clean/rename columns
race_file_data <- purrr::map_dfr(files$files, sheet = "Race & Ethnicity--Reg Forms", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Asian American/Pacific Islander` =  `Asian.American.Pacific.Islander`,
         `Native American/American Indian` = `Native.American.American.Indian`) %>%
  mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a    
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the reg race data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Race & Ethnicity--Reg Forms")
race_reg_data <- full_join(race_reg_template, race_file_data)
writeData(wb, race_reg_data, sheet="Race & Ethnicity--Reg Forms", rowNames=FALSE, startRow=1)

## Add race reg data validation with drop-downs
dataValidation(wb, sheet="Race & Ethnicity--Reg Forms",
               col = 3:8, rows = 2:(nrow(race_reg_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # race yes

## apply styles and set row height for header column
addStyle(wb, sheet = "Race & Ethnicity--Reg Forms", style = bodyStyle, rows=1:(nrow(race_reg_data)+1), cols=1:ncol(race_reg_data), gridExpand = TRUE)
setRowHeights(wb, "Race & Ethnicity--Reg Forms", rows = 1, heights = 64)

## Read expanded race data template (will be used if file doesn't contain an extended race sheet)
race_ext_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Race & Ethnicity--Expanded") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read/Create the ext race data and add to workbook 
addWorksheet(wb, "Race & Ethnicity--Expanded")

## Check whether extended race sheet exists
if (!'Race & Ethnicity--Expanded' %in% file_sheets) {
  race_ext_file_data <- race_file_data %>%
    select(ID, Name) # only adding ID and name from race sheet
  race_ext_data <- full_join(race_ext_template, race_ext_file_data)
} else {
  race_ext_data <- purrr::map_dfr(files$files, sheet = "Race & Ethnicity--Expanded", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>%
    mutate( Name = if("First Name" %in% colnames(.)) str_c(`Last Name`,`First Name`) else Name) %>%
    relocate(Name, .after = ID) %>%
    select(-any_of(c("Middle Name and/or Initial and/or Nickname", "First Name", "Last Name"))) %>%
    mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
    mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
    mutate(across(everything(), str_replace, 'N/A', ''))
}

writeData(wb, race_ext_data, sheet="Race & Ethnicity--Expanded", rowNames=FALSE, startRow=1)

## Add race ext data validation with drop-downs
dataValidation(wb, sheet="Race & Ethnicity--Expanded",
               col = 3:ncol(race_ext_data), rows = 2:(nrow(race_reg_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # race yes

## apply styles and set row height for header column
addStyle(wb, sheet = "Race & Ethnicity--Expanded", style = bodyStyle, rows=1:(nrow(race_reg_data)+1), cols=1:ncol(race_ext_data), gridExpand = TRUE)
setRowHeights(wb, "Race & Ethnicity--Expanded", rows = 1, heights = 64)


# ED & CAREER DATA ---------------------------------------------------------------
## Read ed & career data template 
ed_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Ed & Career") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read ed & career data sheet from all files, clean/rename columns
ed_file_data <- purrr::map_dfr(files$files, sheet = "Ed & Career", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Highest Level of Education Attained` = `Highest.Level.of.Education.Attained`,
         `High School` = `High.School`,
         `College: Undergrad degree (if more than one, list all but create new row for each)` = `College..Undergrad.degree..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `College: Undergrad institution (if more than one, list all but create new row for each)` = `College..Undergrad.institution..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `College: Undergrad year of graduation (if more than one, list all but create new row for each)` = `College..Undergrad.year.of.graduation..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `College: Graduate/ Professional degree (if more than one, list all but create new row for each)` = `College..Graduate..Professional.degree..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `College: Graduate/ Professional institution (if more than one, list all but create new row for each)` = `College..Graduate..Professional.institution..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)` = `College..Graduate..Professional.year.of.graduation..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Military Service` = `Military.Service`,
         `Category of Employment` = `Category.of.Employment`, 
         `Job/ Profession (if more than one, list all but create new row for each)` = `Job..Profession..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Income Level` = `Income.Level`) %>%
  mutate(Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a    
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the ed data and add to workbook (adding columns from new template)
addWorksheet(wb, "Ed & Career")
ed_data <- full_join(ed_template, ed_file_data) %>%
  select(-`Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`)
writeData(wb, ed_data, sheet="Ed & Career", rowNames=FALSE, startRow=1)

## Add ed data validation with drop-downs
dataValidation(wb, sheet="Ed & Career",
               col = 3, rows = 2:(nrow(ed_data)+1), type = "list", 
               value = "'Validations'!$H$2:$H$7") # education
dataValidation(wb, sheet="Ed & Career",
               col = 11, rows = 2:(nrow(ed_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # military yes
dataValidation(wb, sheet="Ed & Career",
               col = 12, rows = 2:(nrow(ed_data)+1), type = "list", 
               value = "'Validations'!$I$2:$I$28") # employment categories

## apply styles and set row height for header column
addStyle(wb, sheet = "Ed & Career", style = bodyStyle, rows=1:(nrow(ed_data)+1), cols=1:ncol(ed_data), gridExpand = TRUE)
setRowHeights(wb, "Ed & Career", rows = 1, heights = 156)

# ELECTORAL POLITICS DATA ---------------------------------------------------------------
## Read electoral politics data template 
electoral_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Electoral Politics") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read electoral data sheet from all files, clean/rename columns
electoral_file_data <- purrr::map_dfr(files$files, sheet = "Electoral Politics", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)` = `Jurisdiction.of.Political.Offices.Held..if.true.for.more.than.one.category..create.a.new.row.for.each.`, 
         `Name of Political Offices Held (if more than one, list all but create new row for each)` = `Name.of.Political.Offices.Held..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Start Year for Political Office` = `Start.Year.for.Political.Office`,
         `End Year for Political Office (if office is still held leave this column blank)` = starts_with("End.Year.for.Political.Office"),
         `Jurisdiction of Political Offices Sought but Lost` = `Jurisdiction.of.Political.Offices.Sought.but.Lost`,
         `Name of Political Offices Sought but Lost (if more than one, list all but create new row for each)` = `Name.of.Political.Offices.Sought.but.Lost..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Year of Race that was Lost` = `Year.of.Race.that.was.Lost`,
         `Political Party Membership` = `Political.Party.Membership`,
         `Identified Self as a Feminist` = `Identified.Self.as.a.Feminist`,
         `state level Commission on the Status of Women` = starts_with("state.level.Commission.on.the.Status.of.Women"),
         `county level Commission on the Status of Women` = starts_with("county.level.Commission.on.the.Status.of.Women"),
         `city level Commission on the Status of Women` = starts_with("city.level.Commission.on.the.Status.of.Women")) %>%
  mutate(Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the electoral data and add to workbook (adding columns from new template)
addWorksheet(wb, "Electoral Politics")
electoral_data <- full_join(electoral_template, electoral_file_data) %>%
  select(-starts_with("Spouse.partner.s.Political."))
writeData(wb, electoral_data, sheet="Electoral Politics", rowNames=FALSE, startRow=1)

## Add electoral data validation with drop-downs
dataValidation(wb, sheet="Electoral Politics",
               cols = 3, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$J$2:$J$5") # electoral level
dataValidation(wb, sheet="Electoral Politics",
               cols = 7, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$K$2:$K$2") # present
dataValidation(wb, sheet="Electoral Politics",
               cols = 8, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$J$2:$J$5") # electoral level
dataValidation(wb, sheet="Electoral Politics",
               cols = 11, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$L$2:$L$17") # party 
dataValidation(wb, sheet="Electoral Politics",
               cols = 12, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$F$2:$F$3") # yes/no
dataValidation(wb, sheet="Electoral Politics",
               cols = 13:16, rows = 2:(nrow(electoral_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # yes

## apply styles and set row height for header column
addStyle(wb, sheet = "Electoral Politics", style = bodyStyle, rows=1:(nrow(electoral_data)+1), cols=1:ncol(electoral_data), gridExpand = TRUE)
setRowHeights(wb, "Electoral Politics", rows = 1, heights = 156)

# SPOUSE DATA ---------------------------------------------------------------
## Read spouse data template 
spouse_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Spouse Partner Info") %>%
  filter(`ID` != "0") #removing any existing data from template

## Create the spouse data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Spouse Partner Info")
spouse_info <- basic_file_data %>%
  select(ID, starts_with("Name.of.Spouse")) %>%
  rename(`Last Name of Spouse/Partner` = starts_with("Name.of.Spouse"))
spouse_info2 <- ed_file_data %>%
  select(ID, `Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  rename(`Spouse's Profession (if more than one, list all but create new row for each)` = `Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  full_join(spouse_info)
spouse_info3 <- electoral_file_data %>%
  select(ID, starts_with("Spouse.partner.s.Political.")) %>%
  rename(`Spouse/partner's Political offices (if more than one, list all but create new row for each)` = starts_with("Spouse.partner.s.Political.")) %>%
  full_join(spouse_info2) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

spouse_data <- full_join(spouse_template, spouse_info3) %>%
  relocate(Notes, .after = last_col())
writeData(wb, spouse_data, sheet="Spouse Partner Info", rowNames=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Spouse Partner Info", style = bodyStyle, rows=1:(nrow(spouse_data)+1), cols=1:ncol(spouse_data), gridExpand = TRUE)
conditionalFormatting(wb, sheet = "Spouse Partner Info", rows=1:(nrow(basic_data)+1), cols=c(3), rule="!=0", style = coloredStyle)
conditionalFormatting(wb, sheet = "Spouse Partner Info", rows=1:(nrow(basic_data)+1), cols=c(3), rule="==0", style = coloredStyle)
setRowHeights(wb, "Spouse Partner Info", rows = 1, heights = 150)

# LEADERSHIP IN ORG DATA ---------------------------------------------------------------
## Read leadership in orgs data template 
leadership_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Leadership in Org") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read leadership data sheet from all files, clean/rename columns
leadership_file_data <- purrr::map_dfr(files$files, sheet = "Leadership in Org", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Specific Name of Leadership Position  (create separate row for each leadership position)` = if("Leadership.positions.in.voluntary.organizations..create.separate.row.for.each.leadership.position.and.identify.the.group." %in% colnames(.)) `Leadership.positions.in.voluntary.organizations..create.separate.row.for.each.leadership.position.and.identify.the.group.`) %>% #if condition takes care if new template is being used
  mutate(Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the leadership data and add to workbook (adding columns from new template)
addWorksheet(wb, "Leadership in Org")
leadership_data <- full_join(leadership_template, leadership_file_data)
writeData(wb, leadership_data, sheet="Leadership in Org", rowNames=FALSE, startRow=1)

## Add leadership data validation with drop-downs
dataValidation(wb, sheet="Leadership in Org",
               cols = 3, rows = 2:(nrow(leadership_data)+1), type = "list", 
               value = "'Validations'!$M$2:$M$10") # leadership role

## apply styles and set row height for header column
addStyle(wb, sheet = "Leadership in Org", style = bodyStyle, rows=1:(nrow(leadership_data)+1), cols=1:ncol(leadership_data), gridExpand = TRUE)
setRowHeights(wb, "Leadership in Org", rows = 1, heights = 156)

# ORG & POLITICAL DATA ---------------------------------------------------------------
## Read political data sheet from all files (don't fix column names)
political_file_data <- purrr::map_dfr(files$files, sheet = "Organizational & Political", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  mutate( Name = if("First Name" %in% colnames(.)) str_c(`Last Name`,`First Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle Name and/or Initial and/or Nickname", "First Name", "Last Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

## Add political data
addWorksheet(wb, "Organizational & Political")
writeData(wb, political_file_data, sheet="Organizational & Political", rowNames=FALSE, startRow=1)

## Add political data validation with drop-downs
dataValidation(wb, sheet="Organizational & Political",
               cols = 3, rows = 2:(nrow(political_file_data)+1), type = "list", 
               value = "'Validations'!$M$2:$M$10") # leadership role

## apply styles and set row height for header column
addStyle(wb, sheet = "Organizational & Political", style = bodyStyle, rows=1:(nrow(political_file_data)+1), cols=1:ncol(political_file_data), gridExpand = TRUE)
setRowHeights(wb, "Organizational & Political", rows = 1, heights = 156)

# ROLE AT NWC DATA ---------------------------------------------------------------
## Read role data template 
role_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Role at NWC") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read role data sheet from all files, clean/rename columns
role_lookup <- c(`Delegate at the NWC` =  "Delegate.at.the.NWC",
                 `Alternate at the NWC` = "Alternate.at.the.NWC",
                 `Nominated for NWC by State Nominating Committee` = "Nominated.for.NWC.by.State.Nominating.Committee",
                 `Votes Received at State Meeting for NWC Delegate/Alternate` = "Votes.Received.at.State.Meeting.for.NWC.Delegate.Alternate",
                 `Delegate-at-Large` =  "Delegate.at.Large",
                 `Ford National Commissioner` = "Ford.National.Commissioner",                                                             
                 `Carter National Commissioner` = "Carter.National.Commissioner",
                 `State Delegation Chair` = "State.Delegation.Chair",
                 `Official Observer` = "Official.Observer",
                 `Journalists Covering the NWC` = "Journalists.Covering.the.NWC",
                 `Notable Speaker` = "Notable.Speaker",
                 `Paid Staff Member` = "Paid.Staff.Member",
                 `Torch Relay Runner` = "Torch.Relay.Runner",
                 `International Dignitary` = "International.Dignitary", 
                 `Unofficial Observer` = "Unofficial.Observer",
                 `Member of State Level IWY Coordinating Committee` = "Member.of.State.Level.IWY.Coordinating.Committee",
                 `Arts Caucus` = "Arts.Caucus",
                 `Asian and Pacific Women's Caucus` = "Asian.and.Pacific.Women.s.Caucus",
                 `Black Women’s Caucus` = "Black.Women.s.Caucus",
                 `Chicana Caucus` = "Chicana.Caucus",
                 `Disabled Women’s Caucus` = "Disabled.Women.s.Caucus",
                 `Farm Women Caucus` = "Farm.Women.Caucus",
                 `Hispanic Caucus` = "Hispanic.Caucus",
                 `Jewish Women’s Caucus` = "Jewish.Women.s.Caucus",
                 `Lesbian Caucus` = "Lesbian.Caucus",
                 `Minority Women’s Caucus` = "Minority.Women.s.Caucus",
                 `National Congress of Neighborhood Women Caucus` = "National.Congress.of.Neighborhood.Women.Caucus",
                 `Peace Caucus` = "Peace.Caucus",
                 `Pro-Plan Caucus` = "Pro.Plan.Caucus",
                 `Puerto Rican Caucus` = "Puerto.Rican.Caucus",
                 `Sex and Poverty IWY Poor and Low Income Women’s Caucus` = "Sex.and.Poverty.IWY.Poor.and.Low.Income.Women.s.Caucus",
                 `Welfare Caucus` = "Welfare.Caucus",
                 `Women in Sports Caucus` = "Women.in.Sports.Caucus",
                 `Youth Caucus` = "Youth.Caucus",
                 `Other Role` = "Other.Role")
role_file_data <- purrr::map_dfr(files$files, sheet = "Role at NWC", read_demographic_data) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  select(ID:`Other.Role`) %>%
  rename(any_of(role_lookup)) %>%
  mutate(Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the role data and add to workbook (adding columns from new template)
addWorksheet(wb, "Role at NWC")
role_data <- full_join(role_template, role_file_data)
writeData(wb, role_data, sheet="Role at NWC", rowNames=FALSE, startRow=1)

## Add role data validation with drop-downs
dataValidation(wb, sheet="Role at NWC",
               col = 3:ncol(role_data)-1, rows = 2:(nrow(role_data)+1), type = "list", 
               value = "'Validations'!$F$2:$F$3") # role yes no

## apply styles and set row height for header column
addStyle(wb, sheet = "Role at NWC", style = bodyStyle, rows=1:(nrow(role_data)+1), cols=1:ncol(role_data), gridExpand = TRUE)
setRowHeights(wb, "Role at NWC", rows = 1, heights = 64)

# POSITION ON PLANKS DATA ---------------------------------------------------------------
## Read planks data template 
planks_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Position on Planks") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read planks data from all files, clean/rename columns
## Check whether planks data sheet exists
if (!'Position on Planks' %in% file_sheets) {
  planks_file_data <- purrr::map_dfr(files$files, sheet = "Role at NWC", read_demographic_data) 
} else {
  planks_file_data <- purrr::map_dfr(files$files, sheet = "Position on Planks", read_demographic_data)
}

planks_file_data <- planks_file_data %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname"))) %>%
  select(ID, Name, `Arts.and.Humanities.Plank`:Notes) %>%
  rename(`Arts and Humanities Plank` = `Arts.and.Humanities.Plank`,
         `Battered Women Plank` = `Battered.Women.Plank`,
         `Business Plank` = `Business.Plank`,
         `Child Abuse Plank` = `Child.Abuse.Plank`,
         `Child Care Plank` = `Child.Care.Plank`, 
         `Credit Plank` = `Credit.Plank`,
         `Disabled Women Plank` = `Disabled.Women.Plank`,
         `Education Plank` = `Education.Plank`,
         `Elective and Appointive Office Plank` = `Elective.and.Appointive.Office.Plank`,
         `Employment Plank` = `Employment.Plank`,
         `Equal Rights Amendment Plank` = `Equal.Rights.Amendment.Plank`,
         `Health Plank` = `Health.Plank`,
         `Homemakers Plank` = `Homemakers.Plank`,
         `Insurance Plank` = `Insurance.Plank`,
         `International Affairs Plank` = `International.Affairs.Plank`,
         `Media Plank` = `Media.Plank`,
         `Minority Women Plank` = `Minority.Women.Plank`,
         `Offenders Plank` = `Offenders.Plank`,
         `Older Women Plank` = `Older.Women.Plank`,
         `Rape Plank` = `Rape.Plank`,
         `Reproductive Freedom Plank` = `Reproductive.Freedom.Plank`,
         `Rural Women Plank` = `Rural.Women.Plank`,
         `Sexual Preference Plank` = `Sexual.Preference.Plank`,
         `Statistics Plank` = `Statistics.Plank`,
         `Women, Welfare and Poverty Plank` = `Women..Welfare.and.Poverty.Plank`,
         `Committee on the Conference Plank` = `Committee.on.the.Conference.Plank`) %>%
  mutate(Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  relocate(Name, .after = ID) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname", "First.Name", "Last.Name"))) %>%
  mutate(across(everything(), str_replace, 'unknown', '')) %>% # remove unknown
  mutate(across(everything(), str_replace, 'n/a', '')) %>% # remove n/a
  mutate(across(everything(), str_replace, 'N/A', ''))

## Create the planks data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Position on Planks")
planks_data <- full_join(planks_template, planks_file_data)
writeData(wb, planks_data, sheet="Position on Planks", rowNames=FALSE, startRow=1)

## Add planks data validation with drop-downs
dataValidation(wb, sheet="Position on Planks",
               col = 3:ncol(planks_data)-1, rows = 2:(nrow(planks_data)+1), type = "list", 
               value = "'Validations'!$G$2:$G$4") # planks

## apply styles and set row height for header column
addStyle(wb, sheet = "Position on Planks", style = bodyStyle, rows=1:(nrow(planks_data)+1), cols=1:ncol(planks_data), gridExpand = TRUE)
setRowHeights(wb, "Position on Planks", rows = 1, heights = 64)

# SIMPLE COPY Questions Sources ---------------------------------------------------------------
addWorksheet(wb, "Questions")
questions_data <- purrr::map_dfr(files$files, col_types = 'text', sheet = "Questions", read_excel)
writeData(wb, questions_data, sheet="Questions", rowNames=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Questions", style = bodyStyle, rows=1:(nrow(questions_data)+1), cols=1:ncol(questions_data), gridExpand = TRUE)
setRowHeights(wb, "Questions", rows = 1, heights = 120)

addWorksheet(wb, "Sources")
sources_data <- purrr::map_dfr(files$files, col_types = 'text', sheet = "Sources", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros 
  #select(ID:"Source 61") %>%
  slice_head(n = 68)
writeData(wb, sources_data, sheet="Sources", rowNames=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Sources", style = bodyStyle, rows=1:(nrow(sources_data)+1), cols=1:ncol(sources_data), gridExpand = TRUE)
setRowHeights(wb, "Sources", rows = 1, heights = 120)

# Write the Excel file --------------------------------------------------------
worksheetOrder(wb) <- c(2, 7, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 1) # move spouse sheet 2nd and put validations sheet last
activeSheet(wb) <- "Basic Data"
saveWorkbook(wb, output_filename, overwrite = TRUE)

## Work in progress Read styles color coding
# library(tidyxl)
# path <- files$files[1]
# 
# formats <- xlsx_formats(path)
# colors_used <- formats$local$fill$patternFill$fgColor$rgb
# 
# cells <-
#   xlsx_cells(path, sheet = "Basic Data") %>%
#   select(row, col, character, style_format, local_format_id) %>%
#   mutate(colored = colors_used[local_format_id]) %>%
#   filter(colored == "FF00FF00")
# cells
# 
# #find rows fo cells  with red background
# cells[ cells$local_format_id %in%
#          which( formats$local$fill$patternFill$fgColor$rgb == "FF00FF00"), 
#        "row" ]
# 
# color_white <- "#FFFFFF00"
# color_pick <- "#FF00FFFF"
# color_yellow <- "#FFFFFF00"
# color_yellow <- "#FFFFFFFF"



