﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpenApiDynamicClient;

public interface IRequestMapper
{
    JsonRequest Map(string operationId, string sourceJson);
}
