# About
This is a simple JavaScript Library for computing eigenvalues, eigenvectors for real symmetric matrix. 

# Basic Usage 
```javascript
Hij = [[0.2,0.1],[0.1,1.1]] 
Out = diag(Hij)
E = Out[0];
U = Out[1];
```
# Slighly "Advanced" Usage 
```javascript
Hij = [[0.2,0.1],[0.1,1.1]] 
\\ sencond parameter is for numerical precision 
Out = diag(Hij,1E-16) 
E = Out[0];
U = Out[1];
\\ you can reduce the sencond parameter reduce accuracy but get results faster
Out = diag(Hij,1E-4) 
E = Out[0];
U = Out[1];
```
---
Arkajit Mandal
University of Rochester