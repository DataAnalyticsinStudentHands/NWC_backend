# This script will first convert all Excel files into separte folders with individual files for each sheet
# Then it will import the separate sheets into a specified collection
import os
import pandas as pd

def file_split(file):
    s = file.split('.')
    name = '.'.join(s[:-1])  # get directory name
    return name


def getsheets(inputfile, fileformat):
    name = file_split(inputfile)
    try:
        os.makedirs(name)
    except:
        pass

    df1 = pd.ExcelFile(inputfile)
    for x in df1.sheet_names:
        print('Created ' + x + '.' + fileformat)
        df2 = pd.read_excel(inputfile, sheet_name=x, keep_default_na=False)
        filename = os.path.join(name, x + '.' + fileformat)
        if fileformat == 'csv':
            df2.to_csv(filename, index=False)
        else:
            df2.to_excel(filename, index=False)
    return name

# assign directory
directory = '/Users/plindner/Development/NWC_backend/data/single_sample'

if __name__ == '__main__':
    print('Read files in directory: ' + directory + '\n')

    # iterate over files in
    # that directory
    for filename in os.listdir(directory):
        inputfile = os.path.join(directory, filename)
        # checking if it is a file
        if os.path.isfile(inputfile):
            if not filename.startswith('.'):
                print(inputfile)
                # STEP 1: convert to single sheet csv files and store in separte directories for each file
                import_directory = getsheets(inputfile, 'csv')
                print('Starting import ... \n')
                execute_import_command = 'node import_participants --directory \"' + import_directory + '\" -b -a -e -p -r -l -o -s'
                os.system(execute_import_command)

    

