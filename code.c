
#include<stdio.h>

int main()
{
    int a, b, c, d;

    printf("Enter IP address: ");
    scanf("%d.%d.%d.%d", &a, &b, &c, &d);

    if (a < 0 || a > 255 ||
        b < 0 || b > 255 ||
        c < 0 || c > 255 ||
        d < 0 || d > 255)
    {
        printf("Invalid IP Address");
    }
    else if (a == 127)
    {
        printf("Loopback address (Reserved)");
    }
    else if (a <= 127)
    {
        printf("Class A");
    }
    else if (a <= 191)
    {
        printf("Class B");
    }
    else if (a <= 223)
    {
        printf("Class C");
    }
    else if (a <= 239)
    {
        printf("Class D");
    }
    else
    {
        printf("Class E");
    }

    return 0;
}
