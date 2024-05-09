import random

# This function creates shares using y = ax + b
def create_shares(a, x, S, q):
    y = (a * x + S) % q
    return (x,y)

# This function converts the characters into ASCII values and returns it.
def getAscii_representation(plaintext):
    ascii_representation = [ord(char) for char in plaintext]
    return ascii_representation

#This function calculates L1 and L2.
def lagrange_polynomial(share1, share2):
    L1N = int(0-share2[0])
    L1D = int(share1[0]-share2[0])
    L2N = int(0-share1[0])
    L2D = int(share2[0]-share1[0])

    return L1N, L1D, L2N, L2D

# This function reconstructs the plaintext using the polynomial.
# It calculates the P(0) using the 2 lagrange polynomials
def reconstruct(polynomial, share1, share2):
    y1 = share1[1]
    y2 = share2[1]
    n1 = polynomial[0]
    d1 = polynomial[1]
    n2 = polynomial[2]
    d2 = polynomial[3]
    
    term1 = ((y1 * n1)/d1)
    term2 = ((y2 * n2)/d2)
    
    if term2 == int(term2):
        term2 = int(term2)
    if term1 == int(term1):
        term1 = int(term1)

    checkT1 = term1
    checkT2 = term2

    if isinstance(term1, float):
        inverse = pow(d1, -1, 127)
        term1 = (y1 * n1 * inverse)
    if isinstance(term2, float):
        inverse = pow(d2, -1, 127)
        term2 = (y2 * n2 * inverse)
        
    if isinstance(checkT1, float):
        term2 = term2 % 127
    elif isinstance(checkT2, float):
        term1 = term1 % 127
    
    term3 = (term1 + term2) % 127

    plaintext = (term3)
    return plaintext



q = 127                                                 #Any prime number
a = random.randint(1, 1000)                             #Random value of A
plaintext = ""
with open("./input.txt", "r") as input_file:
    plaintext = input_file.read();
ascii_representation = getAscii_representation(plaintext)   # Gets the ASCII Values of the chars
number_of_shares = 3                                        # Total number of shares to be created
share1 = []                                                 #Shares stored in the list
share2 = []
share3 = []

# This for loop iterates over all the ASCII values and creates 3 shares for each character.
for secret in ascii_representation:
    for i in range(number_of_shares):
        x = i + 1
        if(i+1 == 1):
            y = create_shares(a, x, secret, q)
            share1.append(y)
        elif(i+1 == 2):
            y = create_shares(a, x, secret, q)
            share2.append(y)
        elif(i+1 == 3):
            y = create_shares(a, x, secret, q)
            share3.append(y)
inp = True
text = plaintext
for i in range(len(share1)):
    print(share1[i], share2[i], share3[i])
while(inp == True):
    print("Plain text: \n\n", text)
    # Ask the user to input what shares are to be used.
    choice1 = int(input("\nSelect the 1st Share: "))
    choice2 = int(input("Select the 2nd Share: "))

    reconstructed_plaintext = ""                                # Stores the reconstructed plaintext.
    lagrange_pol = ""                                           # Stores lagrange's polynomial



    # This for loop iterates over all the shares in the list depending upon the users choice.
    for i in range(len(share1)):
        if(choice1 == 1 and choice2 == 2):
            lagrange_pol = lagrange_polynomial(share1[i], share2[i])
            plaintext = reconstruct(lagrange_pol, share1[i], share2[i])
        elif(choice1 == 1 and choice2 == 3):
            lagrange_pol = lagrange_polynomial(share1[i], share3[i])
            plaintext = reconstruct(lagrange_pol, share1[i], share3[i])
        elif((choice1 == 3 and choice2 == 2)):
            lagrange_pol = lagrange_polynomial(share3[i], share2[i])
            plaintext = reconstruct(lagrange_pol, share3[i], share2[i])
        elif (choice1 == 2 and choice2 == 1):
            lagrange_pol = lagrange_polynomial(share2[i], share1[i])
            plaintext = reconstruct(lagrange_pol, share2[i], share1[i])
        elif (choice1 == 3 and choice2 == 1):
            lagrange_pol = lagrange_polynomial(share3[i], share1[i])
            plaintext = reconstruct(lagrange_pol, share3[i], share1[i])
        elif (choice1 == 2 and choice2 == 3):
            lagrange_pol = lagrange_polynomial(share2[i], share3[i])
            plaintext = reconstruct(lagrange_pol, share2[i], share3[i])
        else:
            print("Please select the appropriate shares.")
        reconstructed_plaintext = reconstructed_plaintext + chr(plaintext) #Add the char to the plaintext again.

    #Print the Resconstructed plaintext.
    print("Reconstructed Plaintext: \n\n", reconstructed_plaintext, "\n")

    cont = input("Do you want to continue [y/N]?: ")
    if cont == "y" or cont == "Y":
        inp = True
    else:
        inp = False

