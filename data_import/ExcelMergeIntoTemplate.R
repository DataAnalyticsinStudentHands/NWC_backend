# Script to convert existing Excel data files into the new template format. 
# It fixes the name column for all non basic data sheets (e.g. removes middle name column and combines first name and last name).
# It is recommended to run this script if the Pre-Flight check lists general issues with column names.
# Makes heavily use of openxlsx library - https://ycphs.github.io/openxlsx/reference/index.html
library(openxlsx)
library(dplyr)
library(readxl)
library(stringr)

# Prepare source data (HAS TO BE IN SEPARATE FOLDER) and name of output file --------------------------------------------------------
## Data will also be merged if multiple files are found (check that you only have files there that need to be fixed/merged)
source_folder <- 'DataDirectory/FordCarter'
#output_filename <- 'California_Fixed_2023-06-02_PL.xlsx'
output_filename <- 'FordCarter_Merged_2023-06-02_PL.xlsx'

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
writeData(wb, validations, sheet="Validations", row.names=FALSE, startRow=1)

## cell styles to be applied later
outputStyle <- createStyle(fontSize = 12, 
                           border = c("top", "bottom", "left", "right"),
                           borderColour = openxlsx_getOp("borderColour", "black"),
                           borderStyle = openxlsx_getOp("borderStyle", "thin"),
                           wrapText = TRUE)
columnStyle <- createStyle(fgFill = "#FFEB57",
                           border = c("top", "bottom", "left", "right"),
                           borderColour = openxlsx_getOp("borderColour", "black"),
                           borderStyle = openxlsx_getOp("borderStyle", "thin"),
                           wrapText = TRUE)

# BASIC DATA -----------------------------------------------------------------------------
## Read basic data template 
basic_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Basic Data") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read basic data sheet from all files, clean/rename column names to avoid issues
basic_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Basic Data", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Last Name` =  `Last.Name`,                                                                                                        
         `First Name` = `First.Name`,                                                                                                       
         `Middle Name and/or Initial 1` =  `Middle.Name.and.or.Initial.and.or.Nickname`,                                                    
         `Age in 1977` =  `Age.in.1977`,
         `Place of Birth` = `Place.of.Birth`, 
         `Total Population of Place of Residence (check US Census)` = `Total.Population.of.Place.of.Residence..check.US.Census.`,
         `Median Household Income of Place of Residence (check US Census)` =  `Median.Household.Income.of.Place.of.Residence..check.US.Census.`,
         `Marital Classification` = `Marital.Classification`,                                                                                
         `Sexual Orientation` =  `Sexual.Orientation`,                                                                                      
         `Total Number of Children (born throughout lifetime)` = `Total.Number.of.Children..born.throughout.lifetime.`)

## Create the basic data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Basic Data")
basic_data <- full_join(basic_template, basic_file_data) %>%
  select(-`Residence.in.1977`, 
         -starts_with("Latitude"),
         -starts_with("Longitude"), 
         -starts_with("Name.of.Spouse"))
writeData(wb, basic_data, sheet="Basic Data", row.names=FALSE, startRow=1)

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
addStyle(wb, sheet = "Basic Data", outputStyle, rows=1:(nrow(basic_data)+1), cols=1:ncol(basic_data), gridExpand = TRUE)
addStyle(wb, sheet = "Basic Data", columnStyle, rows=1:(nrow(basic_data)+1), cols=c(4,5,6), gridExpand = TRUE)
setRowHeights(wb, "Basic Data", rows = 1, heights = 256)

# RACE & ETHNICITY ---------------------------------------------------------------
## Read reg race data template 
race_reg_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Race & Ethnicity--Reg Forms") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read reg race data sheet from all files, clean/rename columns
race_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Race & Ethnicity--Reg Forms", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`Asian American/Pacific Islander` =  `Asian.American.Pacific.Islander`,
         `Native American/American Indian` = `Native.American.American.Indian`) %>%
  mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname")))

## Create the reg race data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Race & Ethnicity--Reg Forms")
race_reg_data <- full_join(race_reg_template, race_file_data)
writeData(wb, race_reg_data, sheet="Race & Ethnicity--Reg Forms", row.names=FALSE, startRow=1)

## Add race reg data validation with drop-downs
dataValidation(wb, sheet="Race & Ethnicity--Reg Forms",
               col = 3:8, rows = 2:(nrow(race_reg_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # race yes

## apply styles and set row height for header column
addStyle(wb, sheet = "Race & Ethnicity--Reg Forms", outputStyle, rows=1:(nrow(race_reg_data)+1), cols=1:ncol(race_reg_data), gridExpand = TRUE)
setRowHeights(wb, "Race & Ethnicity--Reg Forms", rows = 1, heights = 64)

## Read expanded race data template and add to workbook 
race_ext_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Race & Ethnicity--Expanded") %>%
  filter(`ID` != "0") #removing any existing data from template

## Check whether extended race sheet exists


## Create the ext race data and add to workbook (only adding ID and Name)
addWorksheet(wb, "Race & Ethnicity--Expanded")
if (!'Race & Ethnicity--Expanded' %in% file_sheets) {
  race_ext_file_data <- race_file_data %>%
    select(ID, Name)
} else {
  race_ext_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Race & Ethnicity--Expanded", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>%
    mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
    select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname")))
}

race_ext_data <- full_join(race_ext_template, race_ext_file_data)
writeData(wb, race_ext_data, sheet="Race & Ethnicity--Expanded", row.names=FALSE, startRow=1)

## Add race ext data validation with drop-downs
dataValidation(wb, sheet="Race & Ethnicity--Expanded",
               col = 3:ncol(race_ext_data), rows = 2:(nrow(race_reg_data)+1), type = "list", 
               value = "'Validations'!$E$2:$E$2") # race yes

## apply styles and set row height for header column
addStyle(wb, sheet = "Race & Ethnicity--Expanded", outputStyle, rows=1:(nrow(race_reg_data)+1), cols=1:ncol(race_ext_data), gridExpand = TRUE)
setRowHeights(wb, "Race & Ethnicity--Expanded", rows = 1, heights = 64)


# ED & CAREER DATA ---------------------------------------------------------------
## Read ed & career data template 
ed_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Ed & Career") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read ed & career data sheet from all files, clean/rename columns
ed_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Ed & Career", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
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
  mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname")))

## Create the ed data and add to workbook (adding columns from new template)
addWorksheet(wb, "Ed & Career")
ed_data <- full_join(ed_template, ed_file_data) %>%
  select(-`Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`)
writeData(wb, ed_data, sheet="Ed & Career", row.names=FALSE, startRow=1)

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
addStyle(wb, sheet = "Ed & Career", outputStyle, rows=1:(nrow(ed_data)+1), cols=1:ncol(ed_data), gridExpand = TRUE)
setRowHeights(wb, "Ed & Career", rows = 1, heights = 156)

# ELECTORAL POLITICS DATA ---------------------------------------------------------------
## Read electoral politics data template 
electoral_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Electoral Politics") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read electoral data sheet from all files, clean/rename columns
electoral_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Electoral Politics", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  rename(`Jurisdiction of Political Offices Held (if true for more than one category, create a new row for each)` = `Jurisdiction.of.Political.Offices.Held..if.true.for.more.than.one.category..create.a.new.row.for.each.`, 
         `Name of Political Offices Held (if more than one, list all but create new row for each)` = `Name.of.Political.Offices.Held..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Start Year for Political Office` = `Start.Year.for.Political.Office`,
         `End Year for Political Office` = `End.Year.for.Political.Office`,
         `Jurisdiction of Political Offices Sought but Lost` = `Jurisdiction.of.Political.Offices.Sought.but.Lost`,
         `Name of Political Offices Sought but Lost (if more than one, list all but create new row for each)` = `Name.of.Political.Offices.Sought.but.Lost..if.more.than.one..list.all.but.create.new.row.for.each.`,
         `Year of Race that was Lost` = `Year.of.Race.that.was.Lost`,
         `Political Party Membership` = `Political.Party.Membership`,
         `Identified Self as a Feminist` = `Identified.Self.as.a.Feminist`,
         `state level Commission on the Status of Women (include years)` = `state.level.Commission.on.the.Status.of.Women..include.years.`,
         `county level Commission on the Status of Women (include years)` = `county.level.Commission.on.the.Status.of.Women..include.years.`,
         `city level Commission on the Status of Women (include years)` = `city.level.Commission.on.the.Status.of.Women..include.years.`) %>%
  mutate( Name = if("First.Name" %in% colnames(.)) str_c(`Last.Name`,`First.Name`) else Name) %>%
  select(-any_of(c("Middle.Name.and.or.Initial.and.or.Nickname")))

## Create the electoral data and add to workbook (adding columns from new template)
addWorksheet(wb, "Electoral Politics")
electoral_data <- full_join(electoral_template, electoral_file_data) %>%
  select(-`Spouse.partner.s.political..positions..if.more.than.one..list.all.but.create.new.row.for.each.`)
writeData(wb, electoral_data, sheet="Electoral Politics", row.names=FALSE, startRow=1)

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
addStyle(wb, sheet = "Electoral Politics", outputStyle, rows=1:(nrow(electoral_data)+1), cols=1:ncol(electoral_data), gridExpand = TRUE)
setRowHeights(wb, "Electoral Politics", rows = 1, heights = 156)

# SPOUSE DATA ---------------------------------------------------------------
## Read spouse data template 
spouse_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Spouse Partner Info") %>%
  filter(`ID` != "0") #removing any existing data from template

## Create the spouse data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Spouse Partner Info")
spouse_info <- basic_file_data %>%
  select(ID, `Name.of.Spouse..create.additional.row.if.more.than.one.spouse.`) %>%
  rename(`Last Name of Spouse/Partner` = `Name.of.Spouse..create.additional.row.if.more.than.one.spouse.`)
spouse_info2 <- ed_file_data %>%
  select(ID, `Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  rename(`Spouse's Profession (if more than one, list all but create new row for each)` = `Spouse.s.Profession..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  full_join(spouse_info)
spouse_info3 <- electoral_file_data %>%
  select(ID, `Spouse.partner.s.political..positions..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  rename(`Spouse/partner's political positions (if more than one, list all but create new row for each)` = `Spouse.partner.s.political..positions..if.more.than.one..list.all.but.create.new.row.for.each.`) %>%
  full_join(spouse_info2)

spouse_data <- full_join(spouse_template, spouse_info3) %>%
  relocate(Notes, .after = last_col())
writeData(wb, spouse_data, sheet="Spouse Partner Info", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Spouse Partner Info", outputStyle, rows=1:(nrow(spouse_data)+1), cols=1:ncol(spouse_data), gridExpand = TRUE)
addStyle(wb, sheet = "Spouse Partner Info", columnStyle, rows=1:(nrow(spouse_data)+1), cols=c(3), gridExpand = TRUE)
setRowHeights(wb, "Spouse Partner Info", rows = 1, heights = 150)

# LEADERSHIP IN ORG DATA ---------------------------------------------------------------
## Read leadership in orgs data template 
leadership_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Leadership in Org") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read leadership data sheet from all files, clean/rename columns
leadership_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Leadership in Org", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  rename(`Specific Name of Leadership Position  (create separate row for each leadership position)` = `Leadership.positions.in.voluntary.organizations..create.separate.row.for.each.leadership.position.and.identify.the.group.`)

## Create the leadership data and add to workbook (adding columns from new template)
addWorksheet(wb, "Leadership in Org")
leadership_data <- full_join(leadership_template, leadership_file_data)
writeData(wb, leadership_data, sheet="Leadership in Org", row.names=FALSE, startRow=1)

## Add leadership data validation with drop-downs
dataValidation(wb, sheet="Leadership in Org",
               cols = 3, rows = 2:(nrow(leadership_data)+1), type = "list", 
               value = "'Validations'!$M$2:$M$10") # leadership role

## apply styles and set row height for header column
addStyle(wb, sheet = "Leadership in Org", outputStyle, rows=1:(nrow(leadership_data)+1), cols=1:ncol(leadership_data), gridExpand = TRUE)
setRowHeights(wb, "Leadership in Org", rows = 1, heights = 156)

# ORG & POLITICAL DATA ---------------------------------------------------------------
## Read political data sheet from all files (don't fix column names)
political_file_data <- purrr::map_dfr(files$files, col_types = 'text', sheet = "Organizational & Political", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) #pad ID with leading zeros

## Add political data
addWorksheet(wb, "Organizational & Political")
writeData(wb, political_file_data, sheet="Organizational & Political", row.names=FALSE, startRow=1)

## Add political data validation with drop-downs
dataValidation(wb, sheet="Organizational & Political",
               cols = 3, rows = 2:(nrow(political_file_data)+1), type = "list", 
               value = "'Validations'!$M$2:$M$10") # leadership role

## apply styles and set row height for header column
addStyle(wb, sheet = "Organizational & Political", outputStyle, rows=1:(nrow(political_file_data)+1), cols=1:ncol(political_file_data), gridExpand = TRUE)
setRowHeights(wb, "Organizational & Political", rows = 1, heights = 156)

# ROLE AT NWC DATA ---------------------------------------------------------------
## Read role data template 
role_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Role at NWC") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read role data sheet from all files, clean/rename columns
role_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Role at NWC", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  select(ID:`Other.Role`) %>%
  rename(`Delegate at the NWC` =  `Delegate.at.the.NWC`,
         `Alternate at the NWC` = `Alternate.at.the.NWC`, 
         `Delegate-at-Large` =  `Delegate.at.Large`,
         `Ford National Commissioner` = `Ford.National.Commissioner`,                                                             
         `Carter National Commissioner` = `Carter.National.Commissioner`,
         `State Delegation Chair` = `State.Delegation.Chair`,
         `Official Observer` = `Official.Observer`,
         `Journalists Covering the NWC` = `Journalists.Covering.the.NWC`,
         `Notable Speaker` = `Notable.Speaker`,
         `Paid Staff Member` = `Paid.Staff.Member`,
         `Torch Relay Runner` = `Torch.Relay.Runner`,
         `International Dignitary` = `International.Dignitary`, 
         `Unofficial Observer` = `Unofficial.Observer`,
         `Other Role` = `Other.Role`)

## Create the planks data and add to workbook (adding columns from new template)
addWorksheet(wb, "Role at NWC")
role_data <- full_join(role_template, role_file_data)
writeData(wb, role_data, sheet="Role at NWC", row.names=FALSE, startRow=1)

## Add role data validation with drop-downs
dataValidation(wb, sheet="Role at NWC",
               col = 3:ncol(role_data)-1, rows = 2:(nrow(role_data)+1), type = "list", 
               value = "'Validations'!$F$2:$F$3") # role yes no

## apply styles and set row height for header column
addStyle(wb, sheet = "Role at NWC", outputStyle, rows=1:(nrow(role_data)+1), cols=1:ncol(role_data), gridExpand = TRUE)
setRowHeights(wb, "Role at NWC", rows = 1, heights = 64)

# POSITION ON PLANKS DATA ---------------------------------------------------------------
## Read planks data template 
planks_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Position on Planks") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read planks data from all files, clean/rename columns
planks_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Role at NWC", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
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
         `Committee on the Conference Plank` = `Committee.on.the.Conference.Plank`)

## Create the planks data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Position on Planks")
planks_data <- full_join(planks_template, planks_file_data)
writeData(wb, planks_data, sheet="Position on Planks", row.names=FALSE, startRow=1)

## Add planks data validation with drop-downs
dataValidation(wb, sheet="Position on Planks",
               col = 3:ncol(planks_data)-1, rows = 2:(nrow(planks_data)+1), type = "list", 
               value = "'Validations'!$G$2:$G$4") # planks

## apply styles and set row height for header column
addStyle(wb, sheet = "Position on Planks", outputStyle, rows=1:(nrow(planks_data)+1), cols=1:ncol(planks_data), gridExpand = TRUE)
setRowHeights(wb, "Position on Planks", rows = 1, heights = 64)

# SIMPLE COPY Questions Sources ---------------------------------------------------------------
addWorksheet(wb, "Questions")
questions_data <- purrr::map_dfr(files$files, col_types = 'text', sheet = "Questions", read_excel)
writeData(wb, questions_data, sheet="Questions", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Questions", outputStyle, rows=1:(nrow(questions_data)+1), cols=1:ncol(questions_data), gridExpand = TRUE)
setRowHeights(wb, "Questions", rows = 1, heights = 120)

addWorksheet(wb, "Sources")
sources_data <- purrr::map_dfr(files$files, col_types = 'text', sheet = "Sources", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) #pad ID with leading zeros
writeData(wb, sources_data, sheet="Sources", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Sources", outputStyle, rows=1:(nrow(sources_data)+1), cols=1:ncol(sources_data), gridExpand = TRUE)
setRowHeights(wb, "Sources", rows = 1, heights = 120)

# Write the Excel file --------------------------------------------------------
worksheetOrder(wb) <- c(2, 7, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 1) # move spouse sheet 2nd and put validations sheet last
activeSheet(wb) <- "Basic Data"
saveWorkbook(wb, output_filename, overwrite = TRUE)


#Questions for Nancy
#Convert unknown and N/A to empty?
#Copy Research Checklist?
#Remove none from validations for elected offices held?
#How to handle Notes? Columns will stay but renamed e.g. Notes_1 etc. if more than one is found



