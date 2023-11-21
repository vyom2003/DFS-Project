#include "headers.h"

dequeue *DeQueueInit()
{
    dequeue *dq = (dequeue*)malloc(sizeof(dequeue));
    dq->front = NULL;
    dq->back = NULL;
    dq->size = 0;

    return dq;
}

Qnode *QnodeInit()
{
    Qnode *temp = (Qnode*)malloc(sizeof(Qnode));
    temp->data = (char*)malloc(sizeof(char)*MAX_PATH_LENGTH);
    temp->next = NULL;
    temp->prev = NULL;
    return temp;
}

void push_front(dequeue *dq, char *x)
{
    
    Qnode *temp = QnodeInit();
    strcpy(temp->data, x);

    if(isEmpty(dq))
    {
        dq->front = temp;
        dq->back = temp;
        ++dq->size;
        return;
    }

    ++dq->size;
    
    dq->front->next = temp;
    temp->prev = dq->front;
    dq->front = temp;

    return;
}

void push_back(dequeue *dq, char *x)
{   
    Qnode *temp = QnodeInit();
    strcpy(temp->data, x);

    if(isEmpty(dq))
    {
        dq->back = temp;
        dq->front = temp;
        ++dq->size;

        return;
    }
    
    ++dq->size;

    temp->next = dq->back;
    dq->back->prev = temp;
    dq->back = temp;

    return;
}

void pop_front(dequeue *dq)
{
    if(isEmpty(dq)) return;

    if(size(dq) == 1)
    {
        Qnode *temp = dq->front;
        dq->front = NULL;
        dq->back = NULL;
        free(temp);
        --dq->size;
        return;
    }
    
    --dq->size;

    Qnode* temp = dq->front->prev;

    dq->front = temp;
    temp = temp->next;
    dq->front->next = NULL;
    temp->prev = NULL;
    free(temp);
    return;
}

void pop_back(dequeue *dq)
{
    if(isEmpty(dq)) return;

    Qnode *temp = dq->back;

    if(size(dq) == 1)
    {
        dq->back = NULL;
        dq->front = NULL;
        free(temp);
        --dq->size;
        return;
    }

    --dq->size;

    dq->back = dq->back->next;
    temp->next = NULL;
    free(temp);
    return;
}


int isEmpty(dequeue *dq)
{
    if(dq->size == 0) return 1;
    return 0;
}

char *front(dequeue *dq)
{
    if(isEmpty(dq)) return NULL;
    return dq->front->data;
}

char *back(dequeue *dq)
{
    if(isEmpty(dq)) return NULL;
    return dq->back->data;
}

int size(dequeue *dq)
{
    return dq->size;
}

void readPrevHist()
{
    FILE *fd = fopen("history.txt", "r");
    fseek(fd, 0, SEEK_END);
    if(ftell(fd) == 0) 
    {
        fclose(fd);
        return;
    }
    fseek(fd, 0, SEEK_SET);

    char *buffer = (char*)malloc(sizeof(char)*MAX_COMMAND_LENGTH);
    while(fgets(buffer, MAX_COMMAND_LENGTH, fd))
    {
        if(size(hist) >= 20) pop_back(hist);
        push_front(hist, buffer);
    }
    fclose(fd);
    return;
}

void writeToFile()
{
    chdir(HOME);
    FILE *fd = fopen("history.txt", "w");
    if(fd == NULL) 
    {
        chdir(CURR_DIR);
        return;
    }
    Qnode *temp = hist->back;
    while(temp != NULL)
    {
        fprintf(fd, "%s", temp->data);
        temp = temp->next;
    }
    fclose(fd);
    chdir(CURR_DIR);
    return;
}

void PrintHistory(int argc, char* argv[])
{
    if(argc == 1)
    {
        Qnode *temp = hist->back;
        while(temp != NULL)
        {
            printf("%s", temp->data);
            temp = temp->next;
        }
        return;
    }
    for(int i=0;i<strlen(argv[1]);i++)
    {
        if(argv[1][i] < '0' && argv[1][i] > '9') 
        {
            printf("bash: history: %s: numeric argument required\n", argv[1]);
            return;
        }
    }
    int k = atoi(argv[1]), t = k;
    if(k >= size(hist))
    {
        Qnode *temp = hist->back;
        while(temp != NULL)
        {
            printf("%s", temp->data);
            temp = temp->next;
        }
        return;
    }

    Qnode *temp = hist->front;
    while(t > 0 && temp->prev != NULL)
    {
        temp = temp->prev;
        t--;
    }
    temp = temp->next;
    while(t != k && temp != NULL)
    {
        printf("%s", temp->data);
        temp = temp->next;
        t++;
    }
    return;
}