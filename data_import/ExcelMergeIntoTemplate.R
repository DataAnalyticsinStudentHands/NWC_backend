# Script to convert existing Excel data files into the new template format. Makes heavily use of openxlsx library - https://ycphs.github.io/openxlsx/reference/index.html
library(openxlsx)
library(dplyr)
library(readxl)
library(stringr)
library(janitor)

# Prepare source data and name of output file --------------------------------------------------------
## Data will also be merged if multiple files are found
source_folder <- ('DataDirectory/FordCarter')
output_filename <- "FordCarter.xlsx"

## list all source files found in folder
files <- list.files(source_folder, full.names = TRUE, recursive = TRUE, pattern = "xlsx") 
files <- as.data.frame(files)

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

## Read basic data sheet from all files, clean/rename columns
basic_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Basic Data", read_excel) %>%
  clean_names() %>%
  mutate(id = str_pad(id, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`ID` = id,                                                                                                                       
         `Last Name` =  last_name,                                                                                                        
         `First Name` = first_name,                                                                                                       
         `Middle Name and/or Initial 1` =  middle_name_and_or_initial_and_or_nickname,                                                    
         `State` =  state,                                                                                                                
         `Age in 1977` =  age_in_1977,
         `Place of Birth` = place_of_birth, 
         `Residence in 1977` =  residence_in_1977, 
         `Total Population of Place of Residence (check US Census)` = total_population_of_place_of_residence_check_us_census,
         `Median Household Income of Place of Residence (check US Census)` =  median_household_income_of_place_of_residence_check_us_census,
         `Marital Classification` = marital_classification,                                                                                
         `Religion` = religion,                                                                                                        
         `Gender` = gender,                                                                                                              
         `Sexual Orientation` =  sexual_orientation,                                                                                      
         `Total Number of Children (born throughout lifetime)` = total_number_of_children_born_throughout_lifetime,
         `Notes` = notes)

## Create the basic data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Basic Data")
basic_data <- full_join(basic_template, basic_file_data) %>%
  select(-`Residence in 1977`, 
         -starts_with("latitude"),
         -starts_with("longitude"), 
         -starts_with("name_of_spouse_create"))
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
race_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Racial and Ethnic Identifiers", read_excel) %>%
  clean_names() %>%
  mutate(id = str_pad(id, width=4, side="left", pad="0")) %>% #pad ID with leading zeros
  rename(`ID` = id, 
         `Name` = name,
         `Asian American/Pacific Islander` =  asian_american_pacific_islander,
         `Black` = black, 
         `Hispanic` =  hispanic,
         `Native American/American Indian` = native_american_american_indian,                                                             
         `white` = white,
         `Notes` = notes)

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

## Create the ext race data and add to workbook (only adding ID and Name)
addWorksheet(wb, "Race & Ethnicity--Expanded")
race_ext_file_data <- race_file_data %>%
  select(ID, Name)

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
  filter(`ID` != "0") %>% #removing any existing data from template
  select(-Notes)

## Read ed & career data sheet from all files, clean/rename columns
ed_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Ed & Career", read_excel) %>%
  clean_names() %>%
  mutate(id = str_pad(id, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  rename(`ID` = id, 
         `Name` = name,
         `Highest Level of Education Attained` = highest_level_of_education_attained,
         `High School` = high_school,
         `College: Undergrad degree (if more than one, list all but create new row for each)` = college_undergrad_degree_if_more_than_one_list_all_but_create_new_row_for_each,
         `College: Undergrad institution (if more than one, list all but create new row for each)` = college_undergrad_institution_if_more_than_one_list_all_but_create_new_row_for_each,
         `College: Undergrad year of graduation (if more than one, list all but create new row for each)` = college_undergrad_year_of_graduation_if_more_than_one_list_all_but_create_new_row_for_each,
         `College: Graduate/ Professional degree (if more than one, list all but create new row for each)` = college_graduate_professional_degree_if_more_than_one_list_all_but_create_new_row_for_each,
         `College: Graduate/ Professional institution (if more than one, list all but create new row for each)` = college_graduate_professional_institution_if_more_than_one_list_all_but_create_new_row_for_each,
         `College: Graduate/ Professional year of graduation (if more than one, list all but create new row for each)` = college_graduate_professional_year_of_graduation_if_more_than_one_list_all_but_create_new_row_for_each,
         `Military Service` = military_service,
         `Category of Employment` = category_of_employment, 
         `Job/ Profession (if more than one, list all but create new row for each)` = job_profession_if_more_than_one_list_all_but_create_new_row_for_each,
         `Income Level` = income_level)

## Create the ed data and add to workbook (adding columns from new template)
addWorksheet(wb, "Ed & Career")
ed_data <- full_join(ed_template, ed_file_data) %>%
  select(-spouse_s_profession_if_more_than_one_list_all_but_create_new_row_for_each)
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

# SPOUSE DATA ---------------------------------------------------------------
## Read spouse data template 
spouse_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Spouse Partner Info") %>%
  filter(`ID` != "0") #removing any existing data from template

## Create the spouse data and add to workbook (removing columns that are not used in new template)
addWorksheet(wb, "Spouse Partner Info")
spouse_info <- basic_file_data %>%
  select(ID, name_of_spouse_create_additional_row_if_more_than_one_spouse) %>%
  rename(`Last Name of Spouse/Partner` = name_of_spouse_create_additional_row_if_more_than_one_spouse)
spouse_info2 <- ed_file_data %>%
  select(ID, spouse_s_profession_if_more_than_one_list_all_but_create_new_row_for_each) %>%
  rename(`Spouse's Profession (if more than one, list all but create new row for each)` = spouse_s_profession_if_more_than_one_list_all_but_create_new_row_for_each) %>%
  full_join(spouse_info)

spouse_data <- full_join(spouse_template, spouse_info2)
writeData(wb, spouse_data, sheet="Spouse Partner Info", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Spouse Partner Info", outputStyle, rows=1:(nrow(spouse_data)+1), cols=1:ncol(spouse_data), gridExpand = TRUE)
addStyle(wb, sheet = "Spouse Partner Info", columnStyle, rows=1:(nrow(spouse_data)+1), cols=c(3), gridExpand = TRUE)
setRowHeights(wb, "Spouse Partner Info", rows = 1, heights = 120)

# Todo ELECTORAL POLITICS DATA ---------------------------------------------------------------

# Todo LEADERSHIP IN ORG DATA ---------------------------------------------------------------

# Todo ORG & POLITICAL DATA ---------------------------------------------------------------

# ROLE AT NWC DATA ---------------------------------------------------------------
## Read role data template 
role_template <- read_excel("template.xlsx", col_types = 'text', sheet = "Role at NWC") %>%
  filter(`ID` != "0") #removing any existing data from template

## Read role data sheet from all files, clean/rename columns
role_file_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Role at NWC", read_excel) %>%
  clean_names() %>%
  mutate(id = str_pad(id, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  select(id:other_role) %>%
  rename(`ID` = id, 
         `Name` = name,
         `Delegate at the NWC` =  delegate_at_the_nwc,
         `Alternate at the NWC` = alternate_at_the_nwc, 
         `Delegate-at-Large` =  delegate_at_large,
         `Ford National Commissioner` = ford_national_commissioner,                                                             
         `Carter National Commissioner` = carter_national_commissioner,
         `State Delegation Chair` = state_delegation_chair,
         `Official Observer` = official_observer,
         `Journalists Covering the NWC` = journalists_covering_the_nwc,
         `Notable Speaker` = notable_speaker,
         `Paid Staff Member` = paid_staff_member,
         `Volunteer` = volunteer,
         `Exhibitor` = exhibitor,
         `Torch Relay Runner` = torch_relay_runner,
         `International Dignitary` = international_dignitary, 
         `Unofficial Observer` = unofficial_observer,
         `Other Role` = other_role)

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
  clean_names() %>%
  mutate(id = str_pad(id, width=4, side="left", pad="0")) %>% #pad ID with leading zeros %>%
  select(id,name, arts_and_humanities_plank:notes) %>%
  rename(`ID` = id, 
         `Name` = name,
         `Arts and Humanities Plank` = arts_and_humanities_plank,
         `Battered Women Plank` = battered_women_plank,
         `Business Plank` = business_plank,
         `Child Abuse Plank` = child_abuse_plank,
         `Child Care Plank` = child_care_plank, 
         `Credit Plank` = credit_plank,
         `Disabled Women Plank` = disabled_women_plank,
         `Education Plank` = education_plank,
         `Elective and Appointive Office Plank` = elective_and_appointive_office_plank,
         `Employment Plank` = employment_plank,
         `Equal Rights Amendment Plank` = equal_rights_amendment_plank,
         `Health Plank` = health_plank,
         `Homemakers Plank` = homemakers_plank,
         `Insurance Plank` = insurance_plank,
         `International Affairs Plank` = international_affairs_plank,
         `Media Plank` = media_plank,
         `Minority Women Plank` = minority_women_plank,
         `Offenders Plank` = offenders_plank,
         `Older Women Plank` = older_women_plank,
         `Rape Plank` = rape_plank,
         `Reproductive Freedom Plank` = reproductive_freedom_plank,
         `Rural Women Plank` = rural_women_plank,
         `Sexual Preference Plank` = sexual_preference_plank,
         `Statistics Plank` = statistics_plank,
         `Women, Welfare and Poverty Plank` = women_welfare_and_poverty_plank,
         `Committee on the Conference Plank` = committee_on_the_conference_plank,
         `Notes` = notes)

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
questions_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Questions", read_excel)
writeData(wb, questions_data, sheet="Questions", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Questions", outputStyle, rows=1:(nrow(questions_data)+1), cols=1:ncol(questions_data), gridExpand = TRUE)
setRowHeights(wb, "Questions", rows = 1, heights = 120)

addWorksheet(wb, "Sources")
sources_data <- purrr::map_dfr(files$files, col_types = 'text', .name_repair="universal", sheet = "Sources", read_excel) %>%
  mutate(ID = str_pad(ID, width=4, side="left", pad="0")) #pad ID with leading zeros
writeData(wb, sources_data, sheet="Sources", row.names=FALSE, startRow=1)

## apply styles and set row height for header column
addStyle(wb, sheet = "Sources", outputStyle, rows=1:(nrow(sources_data)+1), cols=1:ncol(sources_data), gridExpand = TRUE)
setRowHeights(wb, "Sources", rows = 1, heights = 120)

# Write the Excel file --------------------------------------------------------
worksheetOrder(wb) <- c(2, 6, 3, 4, 5, 7, 8, 9, 10, 1) # put validations sheet last
activeSheet(wb) <- "Basic Data"
saveWorkbook(wb, output_filename, overwrite = TRUE)


#Questions for Nancy
#Convert unknown and N/A to empty
#Copy Research Checklist?
#How to handle Notes? (option 1: combine, option2: leave in sep columns)



